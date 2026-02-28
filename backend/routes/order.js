// backend/routes/order.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * Generate EIN100001, EIN100002, ...
 * Uses a single-row counter (id=1) and a transaction for safety.
 */
async function generateNextOrderNumber(tx) {
  // Ensure counter row exists
  await tx.orderCounter.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, lastNumber: 100000 },
  });

  // Atomically increment
  const counter = await tx.orderCounter.update({
    where: { id: 1 },
    data: { lastNumber: { increment: 1 } },
    select: { lastNumber: true },
  });

  return `EIN${String(counter.lastNumber)}`;
}

// GET /api/orders (newest first)
router.get("/", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return res.json({ ok: true, orders });
  } catch (e) {
    console.error("GET /api/orders ERROR:", e);
    return res.status(500).json({ ok: false, error: "Failed to fetch orders" });
  }
});

// GET /api/orders/by-number/:orderNumber
router.get("/by-number/:orderNumber", async (req, res) => {
  try {
    const { orderNumber } = req.params;

    if (!orderNumber || typeof orderNumber !== "string") {
      return res.status(400).json({ ok: false, error: "orderNumber is required" });
    }

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });

    if (!order) {
      return res.status(404).json({ ok: false, error: "Order not found" });
    }

    return res.json({ ok: true, order });
  } catch (e) {
    console.error("GET /api/orders/by-number/:orderNumber ERROR:", e);
    return res.status(500).json({ ok: false, error: "Failed to fetch order" });
  }
});

// PATCH /api/orders/:id/status
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["PENDING", "PAID", "MAKING", "READY", "COMPLETED", "CANCELED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, error: "Invalid status" });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return res.json({ ok: true, order: updated });
  } catch (e) {
    console.error("PATCH /api/orders/:id/status ERROR:", e);
    return res.status(500).json({ ok: false, error: "Failed to update order" });
  }
});

// POST /api/orders
router.post("/", async (req, res) => {
  try {
    const { userId, guestId, items } = req.body;

    // Must send exactly one customer identity
    if ((!userId && !guestId) || (userId && guestId)) {
      return res.status(400).json({
        ok: false,
        error: "Send exactly one: userId OR guestId",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "items array is required" });
    }

    // Validate items (expects cents as integers)
    for (const it of items) {
      if (!it?.name || typeof it.name !== "string") {
        return res.status(400).json({ ok: false, error: "Each item must have a name" });
      }
      if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
        return res.status(400).json({ ok: false, error: "Each item must have quantity > 0" });
      }
      if (!Number.isInteger(it.unitPrice) || it.unitPrice < 0) {
        return res
          .status(400)
          .json({ ok: false, error: "Each item must have unitPrice in cents (integer)" });
      }
    }

    const createdOrder = await prisma.$transaction(async (tx) => {
      // customerName from DB (snapshot)
      let customerName = "";
      if (userId) {
        const user = await tx.user.findUnique({ where: { id: userId } });
        if (!user) {
          const err = new Error("User not found");
          err.statusCode = 404;
          throw err;
        }
        customerName = user.username;
      } else {
        const guest = await tx.guest.findUnique({ where: { id: guestId } });
        if (!guest) {
          const err = new Error("Guest not found");
          err.statusCode = 404;
          throw err;
        }
        customerName = guest.name;
      }

      const subtotal = items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
      const tax = 0;
      const total = subtotal + tax;

      // ✅ pretty order number
      const orderNumber = await generateNextOrderNumber(tx);

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: userId ?? null,
          guestId: guestId ?? null,
          customerName,
          subtotal,
          tax,
          total,
          items: {
            create: items.map((it) => ({
              name: it.name,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              lineTotal: it.unitPrice * it.quantity,
            })),
          },
        },
        include: { items: true },
      });

      return order;
    });

    return res.json({ ok: true, order: createdOrder });
  } catch (err) {
    console.error("POST /api/orders ERROR:", err);

    if (err && err.statusCode === 404) {
      return res.status(404).json({ ok: false, error: err.message });
    }

    return res.status(500).json({ ok: false, error: "Server error creating order" });
  }
});

module.exports = router;