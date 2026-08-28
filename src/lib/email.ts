import nodemailer from "nodemailer";
import type { OrderStatus } from "@prisma/client";

const senderEmail = process.env.SMTP_USER || "sainibharat277@gmail.com";
const adminEmail = process.env.ADMIN_EMAIL || "sainibharat277@gmail.com";
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

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

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "Order received",
  PROCESSING: "Being prepared",
  SHIPPED: "On the way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

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
    "Thank you for choosing ItraWala. Your order has been received and we will begin preparing it shortly.",
  );
}

type ContactMessage = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export async function sendContactFormEmail(contactData: ContactMessage) {
  const transporter = getTransporter();
  if (!transporter) return;

  const escapedName = escapeHtml(contactData.name);
  const escapedEmail = escapeHtml(contactData.email);
  const escapedPhone = escapeHtml(contactData.phone);
  const escapedSubject = escapeHtml(contactData.subject);
  const escapedMessage = escapeHtml(contactData.message).replace(/\n/g, "<br />");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f6efe3;color:#241813;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">New message - ${escapedSubject}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6efe3;padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffdf9;border:1px solid #eadcc5;">
          <tr><td style="height:7px;background:#5c1a28;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:28px 32px 22px;text-align:center;">
            <div style="color:#5c1a28;font-family:Georgia,serif;font-size:28px;font-weight:bold;letter-spacing:.02em;">ItraWala</div>
            <div style="margin-top:4px;color:#8f7233;font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">ITRAWALA</div>
          </td></tr>
          <tr><td style="padding:0 32px;"><div style="height:1px;background:#bf9b4f;opacity:.55;"></div></td></tr>
          <tr><td style="padding:34px 32px 10px;">
            <p style="margin:0;color:#5c1a28;font-family:Georgia,serif;font-size:25px;line-height:1.3;">New message received</p>
            <p style="margin:14px 0 0;color:#574b45;font-size:15px;line-height:1.7;">You have received a new message through the ItraWala website.</p>
          </td></tr>
          <tr><td style="padding:22px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf6ec;border:1px solid #eadcc5;">
              <tr><td style="padding:20px;">
                <div style="color:#8f7233;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Contact Form Submission</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;color:#574b45;font-size:14px;line-height:1.8;">
                  <tr><td style="padding:8px 0;"><strong>Name:</strong></td><td align="right" style="color:#241813;">${escapedName}</td></tr>
                  <tr><td style="padding:8px 0;"><strong>Email:</strong></td><td align="right" style="color:#241813;"><a href="mailto:${escapedEmail}" style="color:#5c1a28;text-decoration:none;">${escapedEmail}</a></td></tr>
                  <tr><td style="padding:8px 0;"><strong>Phone:</strong></td><td align="right" style="color:#241813;"><a href="tel:${escapedPhone}" style="color:#5c1a28;text-decoration:none;">${escapedPhone}</a></td></tr>
                  <tr><td style="padding:8px 0;"><strong>Subject:</strong></td><td align="right" style="color:#241813;">${escapedSubject}</td></tr>
                </table>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:28px 32px;">
            <div style="background:#fbf6ec;border-left:4px solid #bf9b4f;padding:16px;color:#574b45;font-size:14px;line-height:1.7;">
              <p style="margin:0;font-weight:bold;color:#5c1a28;">Message:</p>
              <p style="margin:12px 0 0;">${escapedMessage}</p>
            </div>
          </td></tr>
          <tr><td style="padding:28px 32px 34px;color:#766a63;font-size:13px;line-height:1.7;">
            <a href="${siteUrl}/admin/contacts" style="color:#5c1a28;font-weight:bold;text-decoration:none;">View in Admin Panel</a>
          </td></tr>
          <tr><td style="padding:18px 32px;background:#5c1a28;color:#f6efe3;text-align:center;font-size:12px;line-height:1.6;">
            Crafted with care in Narnaul, Haryana<br /><span style="color:#e4c77e;">ItraWala &middot; Traditional fragrance, thoughtfully delivered</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  try {
    await transporter.sendMail({
      from: `ItraWala <${senderEmail}>`,
      to: adminEmail,
      subject: `New contact message - ${contactData.subject}`,
      text: `New contact message\n\nName: ${contactData.name}\nEmail: ${contactData.email}\nPhone: ${contactData.phone}\nSubject: ${contactData.subject}\n\nMessage:\n${contactData.message}`,
      html,
    });

    await transporter.sendMail({
      from: `ItraWala <${senderEmail}>`,
      to: contactData.email,
      subject: "We received your message | ItraWala",
      text: `Hello ${contactData.name},\n\nThank you for contacting ItraWala. We have received your message and our team will get back to you soon.\n\nSubject: ${contactData.subject}\n\nItraWala | ${adminEmail}`,
      html: `<p>Hello ${escapeHtml(contactData.name)},</p><p>Thank you for contacting ItraWala. We have received your message and our team will get back to you soon.</p><p><strong>Subject:</strong> ${escapedSubject}</p><p>Regards,<br />ItraWala</p>`,
    });
  } catch (error) {
    console.error("Failed to send contact form email to admin:", error);
    throw new Error("Failed to send email notification");
  }
}

export async function sendAuthConfirmationEmail(email: string, customerName: string, actionLink: string) {
  const transporter = getTransporter();
  if (!transporter) {
    throw new Error("SMTP_PASS is not configured.");
  }

  const safeName = escapeHtml(customerName || "Customer");
  const safeLink = escapeHtml(actionLink);
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f6efe3;color:#241813;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Confirm your ItraWala account</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6efe3;padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffdf9;border:1px solid #eadcc5;">
          <tr><td style="height:7px;background:#5c1a28;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:28px 32px 22px;text-align:center;">
            <div style="color:#5c1a28;font-family:Georgia,serif;font-size:28px;font-weight:bold;letter-spacing:.02em;">ItraWala</div>
            <div style="margin-top:4px;color:#8f7233;font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">TRADITIONAL FRAGRANCE</div>
          </td></tr>
          <tr><td style="padding:0 32px;"><div style="height:1px;background:#bf9b4f;opacity:.55;"></div></td></tr>
          <tr><td style="padding:34px 32px 10px;">
            <p style="margin:0;color:#5c1a28;font-family:Georgia,serif;font-size:25px;line-height:1.3;">Welcome to ItraWala, ${safeName}</p>
            <p style="margin:14px 0 0;color:#574b45;font-size:15px;line-height:1.7;">Thank you for creating an account. Please confirm your email address to finish setting up your account.</p>
          </td></tr>
          <tr><td style="padding:28px 32px;text-align:center;">
            <a href="${safeLink}" style="display:inline-block;background:#5c1a28;color:#fffdf9;padding:14px 24px;font-size:13px;font-weight:bold;letter-spacing:.6px;text-decoration:none;">Confirm My Email Address</a>
          </td></tr>
          <tr><td style="padding:0 32px 30px;color:#766a63;font-size:13px;line-height:1.7;">
            This confirmation link is for your ItraWala account. If you did not create this account, you can safely ignore this email.
          </td></tr>
          <tr><td style="padding:18px 32px;background:#5c1a28;color:#f6efe3;text-align:center;font-size:12px;line-height:1.6;">
            Crafted with care in Narnaul, Haryana<br /><span style="color:#e4c77e;">ItraWala &middot; Traditional fragrance, thoughtfully delivered</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  await transporter.sendMail({
    from: `ItraWala <${senderEmail}>`,
    to: email,
    subject: "Confirm your ItraWala account",
    text: `Hello ${customerName || "Customer"},\n\nPlease confirm your ItraWala account by opening this link:\n${actionLink}\n\nIf you did not create this account, you can ignore this email.`,
    html,
  });
}

export async function sendOrderStatusEmail(order: OrderEmail) {
  await sendOrderEmail(
    order,
    `Order #${order.orderNumber} is ${order.status}`,
    `Your order status has been updated to ${statusLabels[order.status].toLowerCase()}.`,
  );
}

async function sendOrderEmail(order: OrderEmail, subject: string, message: string) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("Email not sent: SMTP_PASS is not configured.");
    return;
  }

  const statusLabel = statusLabels[order.status];
  const customerName = escapeHtml(order.customerName);
  const orderNumber = escapeHtml(order.orderNumber);
  const formattedTotal = `₹${order.total.toFixed(2)}`;
  const adminCopy = adminEmail.toLowerCase() !== order.customerEmail.toLowerCase() ? adminEmail : undefined;
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f6efe3;color:#241813;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(subject)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6efe3;padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fffdf9;border:1px solid #eadcc5;">
          <tr><td style="height:7px;background:#5c1a28;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:28px 32px 22px;text-align:center;">
            <div style="color:#5c1a28;font-family:Georgia,serif;font-size:28px;font-weight:bold;letter-spacing:.02em;">ItraWala</div>
            <div style="margin-top:4px;color:#8f7233;font-size:11px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;">ITRAWALA</div>
          </td></tr>
          <tr><td style="padding:0 32px;"><div style="height:1px;background:#bf9b4f;opacity:.55;"></div></td></tr>
          <tr><td style="padding:34px 32px 10px;">
            <p style="margin:0;color:#5c1a28;font-family:Georgia,serif;font-size:25px;line-height:1.3;">Hello ${customerName},</p>
            <p style="margin:14px 0 0;color:#574b45;font-size:15px;line-height:1.7;">${escapeHtml(message)}</p>
          </td></tr>
          <tr><td style="padding:22px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fbf6ec;border:1px solid #eadcc5;">
              <tr><td style="padding:20px;">
                <div style="color:#8f7233;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Order #${orderNumber}</div>
                <div style="margin-top:14px;display:inline-block;background:#5c1a28;color:#fffdf9;padding:8px 13px;font-size:12px;font-weight:bold;letter-spacing:.5px;">${statusLabel}</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;color:#574b45;font-size:14px;line-height:1.8;">
                  <tr><td>Order total</td><td align="right" style="color:#241813;font-weight:bold;">${formattedTotal}</td></tr>
                </table>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:28px 32px 34px;color:#766a63;font-size:13px;line-height:1.7;">
            We will keep you updated as your order moves through each stage. For help, reply to this email or contact <a href="mailto:${adminEmail}" style="color:#5c1a28;font-weight:bold;text-decoration:none;">${adminEmail}</a>.
          </td></tr>
          <tr><td style="padding:18px 32px;background:#5c1a28;color:#f6efe3;text-align:center;font-size:12px;line-height:1.6;">
            Crafted with care in Narnaul, Haryana<br /><span style="color:#e4c77e;">ItraWala &middot; Traditional fragrance, thoughtfully delivered</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  try {
    await transporter.sendMail({
      from: `ItraWala <${senderEmail}>`,
      to: order.customerEmail,
      ...(adminCopy ? { bcc: adminCopy } : {}),
      subject,
      text: `${subject}\n\nHello ${order.customerName},\n\n${message}\n\nOrder #${order.orderNumber}\nStatus: ${statusLabel}\nTotal: ${formattedTotal}\n\nItraWala | ${adminEmail}`,
      html,
    });
  } catch (error) {
    console.error("Order email failed:", error);
  }
}
