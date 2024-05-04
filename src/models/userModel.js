const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLen: 8,
      maxLen: 15,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userModel);
