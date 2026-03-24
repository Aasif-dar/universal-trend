import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";    

export const generateInvoice = (order) => {

  const invoicePath = `invoices/invoice-${order._id}.pdf`;

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(invoicePath));

  doc.fontSize(20).text("Universal Trend Invoice");

  doc.moveDown();

  doc.text(`Order ID: ${order._id}`);
  doc.text(`Customer: ${order.user.name}`);
  doc.text(`Phone: ${order.phone}`);
  doc.text(`Address: ${order.address}`);

  doc.moveDown();
  doc.text("Items:");

  order.items.forEach((item) => {
    doc.text(
      `${item.name} - ₹${item.price} × ${item.quantity}`
    );
  });

  doc.moveDown();
  doc.text(`Subtotal: ₹${order.subtotal}`);
  doc.text(`Delivery: ₹${order.deliveryCharge}`);
  doc.text(`Total: ₹${order.total}`);

  doc.end();

  return invoicePath;
};