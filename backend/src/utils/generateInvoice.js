import PDFDocument from "pdfkit";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = (booking) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Paths
    const logoPath = path.join(__dirname, "public", "logo.png");

    // Logo (safe)
    try {
      doc.image(logoPath, 50, 40, { width: 100 });
    } catch (e) {
      console.log("Logo not found, skipping...");
    }

    // Header
    doc
      .font("Helvetica")
      .fontSize(10)
      .text("DERLENG COMMUNITY", 350, 50, { align: "right" })
      .text("Phnom Penh, Cambodia", { align: "right" })
      .text("Phone: +855 123 456 78", { align: "right" })
      .text("Email: info@derleng.com", { align: "right" });

    doc.moveDown(2);

    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#0f3d2e")
      .text("BOOKING INVOICE", 0, doc.y, {
        width: doc.page.width,
        align: "center",
      });

    doc.moveDown(1);

    const startX = 50;
    const labelWidth = 140;

    // Safe row function
    const row = (label, value, yPos) => {
      const valueText = value || "N/A";

      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("black")
        .text(label, startX, yPos, { width: labelWidth });

      doc.font("Helvetica").text(valueText, startX + labelWidth, yPos, {
        width: 350,
        lineGap: 2,
      });

      return 25;
    };

    let y = doc.y;

    // Booking Info
    y += row("Trip to:", booking.community_post_id?.title, y);
    y += row("Invoice ID:", booking._id, y);
    y += row("Name:", booking.name, y);
    y += row("Phone:", booking.phone_number, y);
    y += row("Trip Duration:", booking.trip_duration, y);
    y += row("Number of People:", booking.number_of_people?.toString(), y);
    y += row("Your Location:", booking.current_location, y);
    y += row("Trip Date:", new Date(booking.booking_date).toDateString(), y);
    y += row("Booking At:", new Date(booking.created_at).toDateString(), y);

    // ===== TABLE =====
    const tableTop = y + 20;

    doc.font("Helvetica-Bold").fontSize(12);

    doc.text("No", 50, tableTop);
    doc.text("Service", 100, tableTop);
    doc.text("Price", 450, tableTop, { align: "right" });

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    y = tableTop + 25;

    const total = Number(booking.total_price) || 0;

    // Services
    booking.services?.forEach((s, i) => {
      doc.font("Helvetica").fontSize(11);

      doc.text(i + 1, 50, y);
      doc.text(s.name, 100, y, { width: 300 });
      doc.text(`$${s.price}`, 450, y, { align: "right" });

      y += 25;
    });

    // Line
    doc
      .moveTo(300, y + 10)
      .lineTo(550, y + 10)
      .stroke();

    // Total
    doc.font("Helvetica-Bold").fontSize(13).fillColor("#0f3d2e");

    doc.text("Total:", 350, y + 20);
    doc.text(`$${total}`, 450, y + 20, { align: "right" });

    y += 60;

    // ===== ADMIN NOTE =====
    if (booking.admin_note) {
      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor("#0f3d2e")
        .text("Trip Details:", 50, y);

      y += 20;

      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("black")
        .text(booking.admin_note, 50, y, {
          width: 450,
          lineGap: 2,
        });

      y += 60;
    }

    // Footer
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("gray")
      .text("Contact us: info@derleng.com | +855 123 456 78", 50, 700, {
        align: "center",
      });

    doc.moveDown(0.5);

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#0f3d2e")
      .text("Thank you for booking with DERLENG!", {
        align: "center",
      });

    doc.end();
  });
};
