// routes/adminUser.js
const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserController");

// Đăng nhập trang admin
router.post("/login", adminUserController.loginAdmin);

// Đăng xuất trang admin
router.post("/logout", adminUserController.logoutAdmin);

module.exports = router;
