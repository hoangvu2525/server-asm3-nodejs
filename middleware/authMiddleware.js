require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn cần đăng nhập để sử dụng chức năng này" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
    req.user = decoded; // Lưu thông tin người dùng vào request để sử dụng sau
    next(); // Cho phép đi tiếp
  } catch (error) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};

module.exports = authMiddleware;
