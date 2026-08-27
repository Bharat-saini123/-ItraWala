import nodemailer from "nodemailer";
import type { OrderStatus } from "@prisma/client";

const senderEmail = process.env.SMTP_USER || "sainibharat277@gmail.com";
const adminEmail = process.env.ADMIN_EMAIL || "sainibharat277@gmail.com";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

function getTransporter() {
  const password = process.env.SMTP_PASS;
  if (!password) return null;

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user: senderEmail, pass: password },
  });
}

type OrderEmail = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
};

export async function sendOrderCreatedEmail(order: OrderEmail) {
  await sendOrderEmail(
    order,
    `Order confirmed: #${order.orderNumber}`,
    `<p>Thank you for shopping with ItraWala, ${escapeHtml(order.customerName)}.</p><p>Your order <strong>#${escapeHtml(order.orderNumber)}</strong> has been received.</p><p>Total: <strong>₹${order.total.toFixed(2)}</strong></p><p>We will send you another email whenever your order status changes.</p>`,
  );
}

export async function sendOrderStatusEmail(order: OrderEmail) {
  await sendOrderEmail(
    order,
    `Order #${order.orderNumber} is ${order.status}`,
    `<p>Hello ${escapeHtml(order.customerName)},</p><p>Your order <strong>#${escapeHtml(order.orderNumber)}</strong> is now <strong>${order.status}</strong>.</p><p>Total: <strong>₹${order.total.toFixed(2)}</strong></p>`,
  );
}

async function sendOrderEmail(order: OrderEmail, subject: string, html: string) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Email not sent: SMTP_PASS is not configured.");
    return;
  }

  const recipients = Array.from(new Set([order.customerEmail, adminEmail]));
  try {
    await transporter.sendMail({
      from: `ItraWala <${senderEmail}>`,
      to: recipients,
      subject,
      text: subject,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#241813">${html}<p>Regards,<br />ItraWala</p></div>`,
    });
  } catch (error) {
    console.error("Order email failed:", error);
  }
}