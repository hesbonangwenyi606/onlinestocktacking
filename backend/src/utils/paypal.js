import paypal from "@paypal/checkout-server-sdk";

const environment = () => {
  if (process.env.PAYPAL_ENV === "live") {
    return new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
  }
  return new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
};

export const paypalClient = () => {
  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return null;
  }
  return new paypal.core.PayPalHttpClient(environment());
};

export const buildPayPalOrderRequest = ({ total, currency = "USD" }) => {
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: total.toFixed(2)
        }
      }
    ]
  });
  return request;
};

export const buildPayPalCaptureRequest = (orderId) => new paypal.orders.OrdersCaptureRequest(orderId);
