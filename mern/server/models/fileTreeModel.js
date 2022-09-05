const mongoose = require("mongoose");

const fileTreeSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    fileTree: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("FileTree", fileTreeSchema);
