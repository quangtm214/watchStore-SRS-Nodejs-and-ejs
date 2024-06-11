const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true },
  },
  { timestamps: true }
);
const Brand = mongoose.model("Brands", brandSchema);
module.exports = Brand;
