const User = require("../models/User");
const Product = require("../models/Product");

// Lấy giỏ hàng
exports.getCart = async (req, res) => {
  const { idUser } = req.query;
  try {
    const user = await User.findById(idUser);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Thêm vào giỏ hàng
exports.addToCart = async (req, res) => {
  const { idUser, idProduct, count } = req.query;

  try {
    const user = await User.findById(idUser);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const product = await Product.findById(idProduct);
    if (!product)
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });

    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    const existingItem = user.cart.find(
      (item) => item.product.productId.toString() === idProduct
    );

    if (existingItem) {
      existingItem.quantity += parseInt(count);
    } else {
      // Tạo snapshot sản phẩm phù hợp với userSchema
      const productSnapshot = {
        _id: product._id, // _id gốc để tiện hiển thị
        productId: product._id, // để đối chiếu khi cần
        name: product.name,
        price: product.price,
        img1: product.img1,
        short_desc: product.short_desc,
      };

      user.cart.push({
        product: productSnapshot,
        quantity: parseInt(count),
      });
    }

    await user.save();
    res.json({ message: "Đã thêm sản phẩm vào giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Xoá khỏi giỏ hàng
exports.deleteFromCart = async (req, res) => {
  const { idUser, idProduct } = req.query;

  try {
    const user = await User.findById(idUser);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    user.cart = user.cart.filter(
      (item) => item.product.productId.toString() !== idProduct
    );

    await user.save();
    res.json({ message: "Đã xoá sản phẩm khỏi giỏ hàng" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Cập nhật số lượng trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  const { idUser, idProduct, count } = req.query;

  try {
    const user = await User.findById(idUser);
    if (!user)
      return res.status(404).json({ message: "Người dùng không tồn tại" });

    const cartItem = user.cart.find(
      (item) => item.product.productId.toString() === idProduct
    );

    if (!cartItem) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong giỏ hàng" });
    }

    cartItem.quantity = parseInt(count);

    await user.save();
    res.json({ message: "Đã cập nhật số lượng sản phẩm" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
