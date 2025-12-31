import prisma from "../lib/prisma.js";
import { sendOrderConfirmation } from "../utils/email.js";

export const createOrder = async (req, res, next) => {
  const { items, shippingInfo, totalPrice } = req.body;
  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: req.user.id,
          totalPrice: Number(totalPrice),
          shippingInfo
        }
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: item.productId,
            quantity: item.quantity,
            price: Number(item.price)
          }
        });

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      return created;
    });

    await sendOrderConfirmation({
      to: req.user.email,
      orderId: order.id,
      total: totalPrice
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const listMyOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (_req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: { user: true, items: { include: { product: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: req.body.status }
    });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } }
    });
    if (!order) {
      res.status(404);
      return next(new Error("Order not found"));
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};
