// backend/src/reviews.get.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (req, res) {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { username: true } } },
    });
    res.json({ ok: true, reviews });
  } catch (err) {
    console.error("GET /api/reviews ERROR:", err);
    res.status(500).json({ ok: false, message: "Failed to fetch reviews" });
  }
};