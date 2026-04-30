import Notification from "../models/notification.js";

//  Get notifications for logged-in user
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user_id: req.user._id,
    })
      .populate({
        path: "booking_id",
        populate: [
          {
            path: "community_post_id",
            select: "title",
          },
          {
            path: "services",
            select: "name price",
          },
        ],
      })
      .sort({ created_at: -1 });

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
