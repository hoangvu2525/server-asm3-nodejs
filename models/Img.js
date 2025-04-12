const mongoose = require("mongoose");

const imgSchema = new mongoose.Schema({
  banner: { type: String, required: true },
  img1: { type: String, required: true },
  img2: { type: String, required: true },
  img3: { type: String, required: true },
  img4: { type: String, required: true },
  img5: { type: String, required: true },
});

module.exports = mongoose.model("Image", imgSchema);
