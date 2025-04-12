const Order = require("../models/Order");

// Lấy toàn bộ danh sách đơn hàng
exports.getAllHistory = async (req, res) => {
  try {
    const histories = await Order.find();
    res.status(200).json(histories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy dữ liệu", error });
  }
};
