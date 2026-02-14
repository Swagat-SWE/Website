// backend/src/server.js

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();

// Trust proxy only in production (Render)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// =====================
// DB
// =====================
if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is not set. DB routes will fail until you add it.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Render external requires SSL
});

// =====================
// Middleware
// =====================
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// =====================
// Session
// =====================
// IMPORTANT:
// - secure cookies require HTTPS
// - in local dev (http://localhost) secure must be false or cookie won't set
app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "dev_secret_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// =====================
// Routes
// =====================

app.get("/", (req, res) => {
  res.send("Einstein Backend is running");
});

// Health + DB ping
app.get("/health", async (req, res) => {
  try {
    const r = await pool.query("select 1 as ok");
    res.json({
      ok: true,
      message: "Backend is running",
      db: r.rows?.[0]?.ok === 1,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    res.json({
      ok: true,
      message: "Backend is running (DB not reachable)",
      db: false,
      error: e.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// =====================
// DEV Login (Session user)
// =====================
app.post("/auth/login", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ ok: false, error: "email is required" });
  }

  req.session.user = { id: "dev-1", email };

  res.json({
    ok: true,
    message: "Logged in",
    user: req.session.user,
  });
});

app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("sid");
    res.json({ ok: true, message: "Logged out" });
  });
});

app.get("/me", (req, res) => {
  if (!req.session.user) return res.status(401).json({ user: null });
  res.json({ user: req.session.user });
});

// =====================
// Guest APIs (DB + session)
// =====================

// POST /api/guest  body: { displayName: "Swagat" }
app.post("/api/guest", async (req, res) => {
  try {
    const { displayName } = req.body;

    if (!displayName || typeof displayName !== "string") {
      return res.status(400).json({ ok: false, error: "displayName is required" });
    }

    const clean = displayName.trim();
    if (!clean) {
      return res.status(400).json({ ok: false, error: "displayName cannot be empty" });
    }
    if (clean.length > 50) {
      return res.status(400).json({ ok: false, error: "displayName must be 50 chars or less" });
    }

    const result = await pool.query(
      `insert into guest_users (display_name)
       values ($1)
       returning id, display_name, created_at`,
      [clean]
    );

    const guest = result.rows[0];

    // store in session
    req.session.guest = { id: guest.id, displayName: guest.display_name };

    res.json({ ok: true, guest: req.session.guest });
  } catch (e) {
    console.error("POST /api/guest error:", e);
    res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.get("/api/guest/me", (req, res) => {
  if (!req.session.guest) return res.status(401).json({ ok: false, guest: null });
  res.json({ ok: true, guest: req.session.guest });
});

// Test
app.get("/test", (req, res) => {
  res.json({ success: true, data: "API working correctly 🎯" });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
