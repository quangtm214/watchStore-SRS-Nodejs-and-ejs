const mongoose = require("mongoose");
const commentSchema = require("./commentModel");

const watchSchema = new mongoose.Schema(
  {
    watchName: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    Automatic: { type: Boolean, default: false },
    watchDescription: { type: String, required: true },
    comments: [commentSchema],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
  },
  { timestamps: true }
);
const Watch = mongoose.model("Watch", watchSchema);
module.exports = Watch;
