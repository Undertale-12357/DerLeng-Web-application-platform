import {
  createBookingService,
  getAllBookingsService,
  getBookingByIdService,
  updateBookingStatusService,
  deleteBookingService,
  getBookingStatsService,
  getBookingsByUserService,
} from "../services/booking.service.js";
import bot from "../config/telegram.js";
import Notification from "../models/notification.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendEmailWithInvoice } from "../utils/sendEmail.js";
import { sendNotification } from "../utils/socket_booking.js";

/* ---------------- CREATE ---------------- */
export const createBooking = async (req, res) => {
  try {
    //  Validate image
    if (!req.file) {
      return res.status(400).json({
        message: "Transaction image is required",
      });
    }

    //  Parse services safely
    const services = Array.isArray(req.body.services)
      ? req.body.services
      : JSON.parse(req.body.services);

    //  STEP 1: CREATE BOOKING
    const booking = await createBookingService({
      user_id: req.user._id,
      community_post_id: req.body.community_post_id,
      services,
      name: req.body.name,
      phone_number: req.body.phone_number,
      age: req.body.age,
      gender: req.body.gender,
      current_location: req.body.current_location,
      trip_duration: req.body.trip_duration,
      number_of_people: req.body.number_of_people,
      booking_date: req.body.booking_date,
      note: req.body.note,
      transaction_image: req.file.path,
    });

    //  STEP 2: FORMAT SERVICES
    let servicesText = "N/A";

    if (booking.services && booking.services.length > 0) {
      servicesText = booking.services
        .map(
          (service, index) =>
            `${index + 1}. ${service.name} - $${service.price}`,
        )
        .join("\n");
    }

    //  STEP 3: TELEGRAM MESSAGE
    const message = `
📢 <b>NEW BOOKING</b>

👤 <b>Name:</b> ${booking.name}
📞 <b>Phone:</b> ${booking.phone_number}
📍 <b>Location:</b> ${booking.current_location}

👥 <b>People:</b> ${booking.number_of_people}
⏳ <b>Duration:</b> ${booking.trip_duration} days
💰 <b>Total:</b> $${booking.total_price}

📅 <b>Date:</b> ${new Date(booking.booking_date).toDateString()}

🧾 <b>Services:</b>
${servicesText}

📝 <b>Note:</b> ${booking.note || "N/A"}
`;

    //  STEP 4: SEND TO TELEGRAM
    await bot.sendPhoto(
      process.env.TELEGRAM_CHAT_ID,
      booking.transaction_image,
      {
        caption: message,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Approve",
                callback_data: `approve_${booking._id}`,
              },
              {
                text: "❌ Reject",
                callback_data: `reject_${booking._id}`,
              },
            ],
          ],
        },
      },
    );

    //  RESPONSE
    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};
/* ---------------- GET ALL ---------------- */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await getAllBookingsService();
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET ONE ---------------- */
export const getBookingById = async (req, res) => {
  try {
    const booking = await getBookingByIdService(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await getBookingsByUserService(req.user._id);

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE ---------------- */
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, admin_note } = req.body;


    const booking = await updateBookingStatusService(req.params.id, status);

    // Save admin note (IMPORTANT)
    booking.admin_note = admin_note || "";
    await booking.save();

    // ONLY when approved
    if (status === "approved") {
  
      const pdfBuffer = await generateInvoice(booking);


      try {
        await sendEmailWithInvoice(booking.user_id.email, pdfBuffer);
      } catch (err) {
        console.error("Email failed:", err);
      }

 
      const notification = await Notification.create({
        user_id: booking.user_id._id,
        booking_id: booking._id,
        title: "Booking Approved 🎉",
        message: `Your booking has been approved.\n\n${admin_note || ""}`,
      });

  
      sendNotification(booking.user_id._id.toString(), notification);
    }
    if (status === "completed") {
      await Notification.deleteMany({
        booking_id: booking._id,
      });

      // optional: real-time remove
      sendNotification(booking.user_id._id.toString(), {
        type: "REMOVE_NOTIFICATION",
        booking_id: booking._id,
      });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- DELETE ---------------- */
export const deleteBooking = async (req, res) => {
  try {
    await deleteBookingService(req.params.id);
    res.json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ----------------  STATS ---------------- */
export const getBookingStats = async (req, res) => {
  try {
    const data = await getBookingStatsService();
    res.json({ data });
  } catch (err) {
    console.error("BOOKING STATS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
