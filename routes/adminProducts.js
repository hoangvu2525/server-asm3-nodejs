const express = require("express");
const router = express.Router();
const adminProductsController = require("../controllers/adminProductsController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Lấy toàn bộ sản phẩm trang admin
router.get(
  "/",
  adminMiddleware.adminMiddleware,
  adminProductsController.getAllProducts
);

module.exports = router;
