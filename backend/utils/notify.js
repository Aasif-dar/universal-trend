import twilio from "twilio";
import nodemailer from "nodemailer";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 📲 WhatsApp
export const sendWhatsApp = async (order) => {
  const message = `
🛒 New Order Received!

Name: ${order.user.name}
Email: ${order.user.email}
Total: ₹${order.total}

Items:
${order.items.map(
  (i) => `- ${i.name} (${i.size}) x${i.quantity}`
).join("\n")}
`;

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: process.env.ADMIN_WHATSAPP,
    body: message,
  });
};

// 📧 Email
export const sendEmail = async (order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Universal Trend" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: "🛒 New Order Received",
    text: `
New Order Details

Customer: ${order.user.name}
Email: ${order.user.email}
Total: ₹${order.total}

Items:
${order.items.map(
  (i) => `${i.name} (${i.size}) x${i.quantity}`
).join("\n")}
`,
  });
};
