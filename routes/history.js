const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const authMiddleware = require("../middleware/authMiddleware"); 

// Lấy danh sách lịch sử đặt hàng theo user
router.get("/", authMiddleware, historyController.getHistory);

// Lấy chi tiết 1 đơn hàng
router.get("/:id", authMiddleware, historyController.getDetail);

module.exports = router;
