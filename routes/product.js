const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Lấy toàn bộ danh sách sản phẩm
router.get("/", productController.getAllProducts);

// Lấy thông tin sản phẩm theo ID
router.get("/:id", productController.getProductById);

module.exports = router;
