const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { body } = require("express-validator");

// Đăng ký tài khoản
router.post(
  "/signup",
  [
    body("fullname").notEmpty().withMessage("Vui lòng điền họ tên"),
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu ít nhất là 6 ký tự"),
    body("phone").notEmpty().withMessage("Vui lòng điền số điện thoại"),
  ],
  userController.signUp
);

// Đăng nhập tài khoản
router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password").notEmpty().withMessage("Vui lòng nhập mật khẩu"),
  ],
  userController.signIn
);

// Đăng xuất
router.post("/logout", userController.logoutUser);

// Lấy thông tin người dùng theo ID
router.get("/:id", userController.getUserById);

module.exports = router;
