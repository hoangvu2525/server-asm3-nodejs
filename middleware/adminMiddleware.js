require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware cho admin đi qua
exports.adminMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    // Lấy thông tin user từ DB
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không phải admin" });
    }

    req.user = user; // lưu thông tin user cho các middleware tiếp theo
    next();
  } catch (err) {
    res.status(500).json({ message: "Lỗi Server", error: err.message });
  }
};

// Middleware cho admin và Tư vấn viên đi qua
exports.adminCSMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) return res.status(401).json({ message: "Not authenticated" });

    // Giải mã token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    // Lấy thông tin user từ DB
    const user = await User.findById(decoded.id);
    if (!user || user.role == "client") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    req.user = user; // lưu thông tin user cho các middleware tiếp theo
    next();
  } catch (err) {
    res.status(500).json({ message: "Lỗi Server", error: err.message });
  }
};
