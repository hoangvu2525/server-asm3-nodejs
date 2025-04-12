require("dotenv").config();
const Order = require("../models/Order");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const User = require("../models/User");

// Tạo transporter cho Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Tạo đơn hàng mới và gửi mail cho người dùng khi tạo thành công
const createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Dữ liệu không hợp lệ", errors: errors.array() });
  }

  try {
    const { userId, fullname, email, phone, address, total, products } =
      req.body;

    const newOrder = new Order({
      userId,
      fullname,
      email,
      phone,
      address,
      total,
      products,
    });

    const savedOrder = await newOrder.save();
    await User.findByIdAndUpdate(userId, { cart: [] });
    // Lấy img1 từ productId trong products
    const populatedOrder = await Order.findById(savedOrder._id).populate(
      "products.productId",
      "img1"
    );

    // Tạo HTML cho danh sách sản phẩm
    const productListHTML = populatedOrder.products
      .map((p) => {
        const image = p.productId.img1;
        return `
      <tr>
        <td style="border: 1px solid #fff; padding: 10px; text-align: center;">${
          p.name
        }</td>
        <td style="border: 1px solid #fff; padding: 10px; text-align: center;">
          <img src="${image}" alt="${p.name}" width="60" />
        </td>
        <td style="border: 1px solid #fff; padding: 10px; text-align: center;">
          ${Number(p.price).toLocaleString()} VND
        </td>
        <td style="border: 1px solid #fff; padding: 10px; text-align: center;">${
          p.quantity
        }</td>
        <td style="border: 1px solid #fff; padding: 10px; text-align: center;">
          ${(p.price * p.quantity).toLocaleString()} VND
        </td>
      </tr>
    `;
      })
      .join("");

    const mailOptions = {
      from: '"Hệ thống đặt hàng" <tranhoangvu2525@gmail.com>',
      to: email,
      subject: "Xác nhận đơn hàng thành công!",
      html: `
    <div style="background-color: #111; color: #fff; font-family: Arial, sans-serif; padding: 20px;">
      <h2>Xin Chào ${fullname}</h2>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Address:</strong> ${address}</p>

      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr>
            <th style="border: 1px solid #fff; padding: 10px;">Tên Sản Phẩm</th>
            <th style="border: 1px solid #fff; padding: 10px;">Hình Ảnh</th>
            <th style="border: 1px solid #fff; padding: 10px;">Giá</th>
            <th style="border: 1px solid #fff; padding: 10px;">Số Lượng</th>
            <th style="border: 1px solid #fff; padding: 10px;">Thành Tiền</th>
          </tr>
        </thead>
        <tbody>
          ${productListHTML}
        </tbody>
      </table>

      <h3 style="margin-top: 30px;">Tổng Thanh Toán:</h3>
      <h2 style="color: #f0c040;">${Number(total).toLocaleString()} VND</h2>

      <p>Đơn đặt thành công vào: ${new Date().toLocaleString()}</p>
      <p style="margin-top: 30px;">Cảm ơn bạn!</p>
    </div>
  `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Đặt hàng thành công", order: savedOrder });
  } catch (error) {
    console.error("Lỗi khi đặt hàng: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { createOrder };
