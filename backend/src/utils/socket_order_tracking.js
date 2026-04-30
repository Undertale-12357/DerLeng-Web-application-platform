
const io = getIO();
io.to(order.user._id.toString()).emit("orderUpdate", {
  orderId: order._id,
  status: order.status,
  message: `Your order status has changed to ${order.status}.`,
  updatedAt: new Date(),
});
