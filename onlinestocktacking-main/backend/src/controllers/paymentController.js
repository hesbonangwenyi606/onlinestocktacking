import prisma from "../lib/prisma.js";
import { paypalClient, buildPayPalOrderRequest, buildPayPalCaptureRequest } from "../utils/paypal.js";

export const createPayPalOrder = async (req, res, next) => {
  try {
    const client = paypalClient();
    if (!client) {
      res.status(500);
      return next(new Error("PayPal is not configured"));
    }
    const { total } = req.body;
    const request = buildPayPalOrderRequest({ total: Number(total) });
    const response = await client.execute(request);
    res.json({ id: response.result.id, status: response.result.status });
  } catch (error) {
    next(error);
  }
};

export const capturePayPalOrder = async (req, res, next) => {
  try {
    const client = paypalClient();
    if (!client) {
      res.status(500);
      return next(new Error("PayPal is not configured"));
    }
    const { orderId, localOrderId } = req.body;
    const request = buildPayPalCaptureRequest(orderId);
    const response = await client.execute(request);

    if (localOrderId) {
      await prisma.order.update({
        where: { id: localOrderId },
        data: {
          paymentId: orderId,
          paymentStatus: response.result.status,
          status: "PAID"
        }
      });
    }

    res.json({ status: response.result.status, details: response.result });
  } catch (error) {
    next(error);
  }
};
