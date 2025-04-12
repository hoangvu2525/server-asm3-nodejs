const Order = require("../models/Order");

// Lấy lịch sử giao dịch của người dùng
const getHistory = async (req, res) => {
  const { idUser } = req.query;
  try {
    const history = await Order.find({ userId: idUser }).sort({
      createdAt: -1,
    });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy lịch sử", error: err });
  }
};

// Lấy chi tiết 1 đơn hàng
const getDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate(
      "products.productId",
      "img1"
    );
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: err });
  }
};

module.exports = { getHistory, getDetail };
