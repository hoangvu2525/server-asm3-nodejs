const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware");

// Lấy giỏ hàng của người dùng
router.get("/", cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", authMiddleware, cartController.addToCart);

// Xóa sản phẩm khỏi giỏ hàng
router.delete("/delete", authMiddleware, cartController.deleteFromCart);

// Cập nhật sản phẩm của giỏ hàng
router.put("/update", authMiddleware, cartController.updateCartItem);

module.exports = router;
