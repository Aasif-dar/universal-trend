import nodemailer from "nodemailer";

export const sendOTPEmail = async (to, otp, type = "verify") => {

  console.log(process.env.EMAIL_USER);
  console.log(process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Universal Trend" <${process.env.EMAIL_USER}>`,
    to,
    subject: "OTP",
    html: `<h1>${otp}</h1>`,
  });
};


export const sendOrderEmail = async ({
  customerName,
  customerEmail,
  phone,
  total,
  address,
  paymentMethod,
  items,
}) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Universal Trend" <${process.env.EMAIL_USER}>`,

    to: process.env.ADMIN_EMAIL,

    subject: "New Order Received",

    html: `
      <h2>New Order Received</h2>

      <p>
        <strong>Customer:</strong>
        ${customerName}
      </p>

      <p>
        <strong>Email:</strong>
        ${customerEmail}
      </p>

      <p>
        <strong>Phone:</strong>
        ${phone}
      </p>

      <p>
        <strong>Total:</strong>
        ₹${total}
      </p>

      <p>
        <strong>Payment:</strong>
        ${paymentMethod}
      </p>

      <p>
        <strong>Address:</strong>
        ${address}
      </p>

      <h3>Items Ordered:</h3>

      <ul>
        ${items
          .map(
            (item) => `
              <li>
                ${item.name}
                × ${item.quantity}
              </li>
            `
          )
          .join("")}
      </ul>
    `,
  });
};