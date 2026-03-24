import nodemailer from "nodemailer";

export const sendEmail = async (order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const itemsList = order.items
    .map(
      (i) =>
        `${i.name} x${i.quantity} - ₹${i.price}`
    )
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // 📩 YOU receive it
    subject: "🛒 New Order - Universal Trend",
    text: `
New Order Received!

Customer:
Name: ${order.user.name}
Email: ${order.user.email}
Phone: ${order.phone}

Address:
${order.address}

Items:
${itemsList}

Delivery Charge: ₹${order.deliveryCharge}
Total Amount: ₹${order.total}

Payment Method: ${order.paymentMethod}
Order Status: ${order.status}
`,
  };

  await transporter.sendMail(mailOptions);
};
