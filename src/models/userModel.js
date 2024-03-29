const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
    },
    bio: {
      type: String,
    },
    userID: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
    },
    boxArray: [String],
    accessArray: [String],
    shareArray: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
