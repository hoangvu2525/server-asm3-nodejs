require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const Product = require("./models/Product");
const userRoutes = require("./routes/user");
const http = require("http");
const Image = require("./models/Img");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoute = require("./routes/order");
const historyRoutes = require("./routes/history");
const adminUserRoutes = require("./routes/adminUser");
const adminProductRoute = require("./routes/adminProducts");
const historyRoute = require("./routes/adminHistory");

const app = express(); // Khởi tạo ứng dụng Express
const server = http.createServer(app); // Tạo server HTTP từ Express app

const io = new Server(server, {
  // Tạo server Socket.IO kèm cấu hình CORS

  cors: {
    origin: "*", //Cho phép mọi nguồn truy cập
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT; // Khai báo cổng server

const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true, // cho phép gửi cookie từ frontend
  })
);
app.use(express.json()); // Cho phép Express đọc JSON từ body request

app.use(cookieParser()); // Middleware để đọc cookie từ request

// Routes
app.use("/users", userRoutes);

app.use("/img", express.static(path.join(__dirname, "data/img")));

app.use("/carts", cartRoutes);
app.use("/order", orderRoute);
app.use("/histories", historyRoutes);

// API để lấy ảnh trang chủ
app.get("/home-images", async (req, res) => {
  try {
    const imageData = await Image.findOne();
    if (!imageData)
      return res.status(404).json({ message: "No image data found" });
    res.json(imageData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching image data", error });
  }
});

app.use("/products", productRoutes);
app.use("/admin", adminUserRoutes);
app.use("/admin-products", adminProductRoute);
app.use("/admin-histories", historyRoute);

io.on("connection", (socket) => {
  console.log(" New client connected:", socket.id);

  // Nhận và gửi message
  socket.on("sendMessage", (data) => {
    console.log(" Message received:", data);
    io.emit("receiveMessage", data); // Gửi lại message cho tất cả clients
  });

  socket.on("disconnect", () => {
    console.log(" Client disconnected:", socket.id);
  });
});

// Connect MongoDB và chạy server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(" Connected to MongoDB");

    // importData(); //  Import dữ liệu lên mongodb
    // importImages(); // Import ảnh mongodb

    server.listen(PORT, () => {
      console.log(` Server running`);
    });
  })
  .catch((err) => console.error(" MongoDB connection error:", err));

// Hàm import dữ liệu từ JSON
// async function importData() {
//   try {
//     const rawData = fs.readFileSync("./data/products.json", "utf-8");
//     const data = JSON.parse(rawData);

//     // Kiểm tra nếu chưa có dữ liệu thì mới insert
//     const count = await Product.countDocuments();
//     if (count === 0) {
//       const products = data.map((item) => ({
//         category: item.category,
//         img1: item.img1,
//         img2: item.img2,
//         img3: item.img3,
//         img4: item.img4,
//         long_desc: item.long_desc,
//         short_desc: item.short_desc,
//         name: item.name,
//         price: Number(item.price), //  Chuyển string sang number
//       }));

//       await Product.insertMany(products);
//       console.log(" Products imported successfully");
//     } else {
//       console.log(" Products already exist in database, skipping import.");
//     }
//   } catch (error) {
//     console.error("Error importing products:", error.message);
//   }
// }

// async function importImages() {
//   try {
//     const raw = fs.readFileSync("./data/img/images.json", "utf-8");
//     const imgData = JSON.parse(raw);

//     const count = await Image.countDocuments();
//     if (count === 0) {
//       const newImage = new Image({
//         banner: imgData.banner,
//         img1: imgData.img1,
//         img2: imgData.img2,
//         img3: imgData.img3,
//         img4: imgData.img4,
//         img5: imgData.img5,
//       });

//       await newImage.save();
//       console.log("Ảnh up thành công");
//     } else {
//       console.log("Ảnh đã tồn tại, bỏ qua");
//     }
//   } catch (err) {
//     console.error("Lỗi khi up ảnh", err.message);
//   }
// }
