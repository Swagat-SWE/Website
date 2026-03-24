// backend/src/reviews.post.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async function (req, res) {
  try {
    const { rating, comment, userId, guestName } = req.body;

    if (!rating) return res.status(400).json({ ok: false, message: "Rating is required" });

    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment || null,
        userId: userId || null,
        guestName: guestName || null,
      },
    });

    res.json({ ok: true, review });
  } catch (err) {
    console.error("POST /api/reviews ERROR:", err);
    res.status(500).json({ ok: false, message: "Failed to save review" });
  }
};