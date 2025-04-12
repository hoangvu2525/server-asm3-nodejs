const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware"); 

// Tạo đơn hàng mới
router.post(
  "/create",
  authMiddleware,

  [
    body("userId").notEmpty().withMessage("userId không được để trống"),
    body("fullname").notEmpty().withMessage("fullname không được để trống"),
    body("email").isEmail().withMessage("email không hợp lệ"),
    body("phone").notEmpty().withMessage("phone không được để trống"),
    body("address").notEmpty().withMessage("address không được để trống"),
    body("total").notEmpty().withMessage("total không được để trống"),
    body("products")
      .isArray({ min: 1 })
      .withMessage("products phải là một mảng và không được rỗng"),
  ],

  orderController.createOrder
);

module.exports = router;
