// backend/src/server.js

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
const app = express();

// =====================
// Middleware
// =====================
app.use(
  cors({
    origin: ["http://localhost:3000", "https://localhost:3000"],
    credentials: true,
  })
);


app.use(express.json());

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // localhost dev
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// =====================
// Basic Routes
// =====================

app.get("/", (req, res) => {
  res.send("Einstein Backend is running");
});

app.get("/health", async (req, res) => {
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
  });
});

// =====================
// REGISTER (Persistent user)
// =====================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ ok: false, error: "Username & password required" });

    // basic username rules (you can adjust)
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({
        ok: false,
        error: "Username must be 3-20 chars and only letters, numbers, underscore.",
      });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return res.status(409).json({ ok: false, error: "Username already exists" });

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { username, password: hashed },
      select: { id: true, username: true, createdAt: true },
    });

    req.session.user = { id: user.id, username: user.username };

    res.status(201).json({ ok: true, user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

// =====================
// LOGIN
// =====================

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ ok: false, error: "Username & password required" });

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ ok: false, error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ ok: false, error: "Invalid credentials" });

  req.session.user = { id: user.id, username: user.username };

  res.json({ ok: true });
});


// =====================
// LOGOUT (User)
// =====================

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ ok: true });
  });
});

// =====================
// GUEST CREATE (Temporary)
// =====================

app.post("/api/guest", async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ ok: false, error: "Name required" });

  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

  const guest = await prisma.guest.create({
    data: { name, expiresAt },
    select: { id: true, name: true, expiresAt: true },
  });

  req.session.guest = { id: guest.id, name: guest.name };

  res.json({ ok: true, guest });
});

// =====================
// GUEST LOGOUT (Deletes guest)
// =====================

app.post("/api/guest/logout", async (req, res) => {
  if (req.session.guest?.id) {
    await prisma.guest.delete({
      where: { id: req.session.guest.id },
    }).catch(() => null);
  }

  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ ok: true });
  });
});

// =====================
// WHO AM I
// =====================

app.get("/api/me", (req, res) => {
  if (req.session.user) return res.json({ type: "user", user: req.session.user });
  if (req.session.guest) return res.json({ type: "guest", guest: req.session.guest });
  res.status(401).json({ type: null });
});

// =====================
// 404
// =====================

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// =====================
// Start
// =====================

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
