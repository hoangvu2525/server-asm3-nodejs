const express = require("express");
const router = express.Router();
const adminHistoryController = require("../controllers/adminHistoryController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Lấy toàn bộ thông tin đơn hàng ở trang admin
router.get(
  "/",
  adminMiddleware.adminCSMiddleware,
  adminHistoryController.getAllHistory
);

module.exports = router;
