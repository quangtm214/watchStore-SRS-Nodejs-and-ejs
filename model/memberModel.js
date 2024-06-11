const mongoose = require("mongoose");
const memberSchema = new mongoose.Schema(
  {
    membername: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

const Member = mongoose.model("Members", memberSchema);
module.exports = Member;
