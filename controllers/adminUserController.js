require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Hàm xử lý đăng nhập
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // So sánh mật khẩu đã mã hóa
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    // Chặn client đăng nhập
    if (foundUser.role === "client") {
      return res
        .status(403)
        .json({ message: "Không cho phép client đăng nhập trang admin" });
    }

    // Tạo JWT
    const token = jwt.sign(
      { id: foundUser._id, role: foundUser.role },
      process.env.JWT_SECRET_ADMIN
    );

    // Gửi token qua cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        _id: foundUser._id,
        fullname: foundUser.fullname,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Hàm xử lý đăng xuất
exports.logoutAdmin = (req, res) => {
  res.clearCookie("access_token"); // Xóa cookie xác thực
  return res.status(200).json({ message: "Đăng xuất thành công" });
};
