import nodemailer from "nodemailer";

const createTransporter = () => {
  if (!process.env.SMTP_HOST) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

export const sendOrderConfirmation = async ({ to, orderId, total }) => {
  const transporter = createTransporter();
  if (!transporter) {
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@onlinestocktacking.com",
    to,
    subject: `Order Confirmation #${orderId}`,
    text: `Thanks for your order! Total: $${total}.`,
    html: `<p>Thanks for your order!</p><p>Order: <strong>${orderId}</strong></p><p>Total: <strong>$${total}</strong></p>`
  });
};
