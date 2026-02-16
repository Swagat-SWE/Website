// backend/src/server.js

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

// -------------------
// App + Prisma
// -------------------
const app = express();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

// -------------------
// Env + Safety
// -------------------
const isProd = process.env.NODE_ENV === "production";

// Render sits behind a proxy (HTTPS terminates before Node)
if (isProd) {
  app.set("trust proxy", 1);
}

// In production, do NOT allow missing secret
if (isProd && !process.env.SESSION_SECRET) {
  console.error("❌ SESSION_SECRET is missing in production!");
  process.exit(1);
}

// -------------------
// Middleware
// -------------------
app.use(express.json());

// ✅ CORS: allow your frontend + localhost
const allowedOrigins = [
  "http://localhost:3000",
  "https://localhost:3000",
  "http://127.0.0.1:3000",
  "https://einsteinstogo.com",
  "https://www.einsteinstogo.com",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow no-origin requests (curl, Render health checks, etc.)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// ✅ Session cookie config for cross-domain cookies (frontend + backend on different domains)
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev_secret_only",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: isProd ? "none" : "lax", // MUST be "none" for cross-domain cookies
      secure: isProd, // MUST be true on HTTPS
    },
  })
);

// -------------------
// Routes
// -------------------
app.get("/", (req, res) => {
  res.send("Einstein Backend is running");
});

app.get("/health", (req, res) => {
  res.json({
    ok: true,
    env: isProd ? "production" : "development",
    timestamp: new Date().toISOString(),
  });
});

// -------------------
// REGISTER (Persistent User)
// -------------------
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "Username & password required" });
    }

    // ✅ Username rules: 3–10 chars, letters/numbers/underscore only
    if (!/^[a-zA-Z0-9_]{3,10}$/.test(username)) {
      return res.status(400).json({
        ok: false,
        error: "Username must be 3-10 characters and only letters, numbers, underscore.",
      });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return res.status(409).json({ ok: false, error: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { username, password: hashed },
      select: { id: true, username: true, createdAt: true },
    });

    req.session.user = { id: user.id, username: user.username };
    delete req.session.guest;

    return res.status(201).json({ ok: true, user });
  } catch (e) {
    console.error("REGISTER ERROR:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// -------------------
// LOGIN
// -------------------
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: "Username & password required" });
    }

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ ok: false, error: "Invalid credentials" });

    req.session.user = { id: user.id, username: user.username };
    delete req.session.guest;

    return res.json({ ok: true });
  } catch (e) {
    console.error("LOGIN ERROR:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// -------------------
// LOGOUT (User)
// -------------------
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid", {
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    });
    res.json({ ok: true });
  });
});

// -------------------
// GUEST CREATE (Temporary)
// -------------------
app.post("/api/guest", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ ok: false, error: "Name required" });

    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

    const guest = await prisma.guest.create({
      data: { name, expiresAt },
      select: { id: true, name: true, expiresAt: true },
    });

    req.session.guest = { id: guest.id, name: guest.name };
    delete req.session.user;

    return res.json({ ok: true, guest });
  } catch (e) {
    console.error("GUEST ERROR:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// -------------------
// GUEST LOGOUT (Deletes guest)
// -------------------
app.post("/api/guest/logout", async (req, res) => {
  try {
    if (req.session.guest?.id) {
      await prisma.guest.delete({ where: { id: req.session.guest.id } }).catch(() => null);
    }

    req.session.destroy(() => {
      res.clearCookie("sid", {
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
      });
      res.json({ ok: true });
    });
  } catch (e) {
    console.error("GUEST LOGOUT ERROR:", e);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

// -------------------
// WHO AM I
// -------------------
app.get("/api/me", (req, res) => {
  if (req.session.user) return res.json({ ok: true, type: "user", user: req.session.user });
  if (req.session.guest) return res.json({ ok: true, type: "guest", guest: req.session.guest });
  return res.status(401).json({ ok: false, type: null });
});

// -------------------
// 404
// -------------------
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

// -------------------
// Start
// -------------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
