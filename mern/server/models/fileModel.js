const mongoose = require('mongoose');

//add user id in schema
const fileSchema = mongoose.Schema(
  {
    ownerEmail: {
      type: String,
      required: true,
      trim: true
    },
    fileName: {
      type: String,
      required: true,
      trim: true
    },
    file_path: {
      type: String,
      required: true
    },
    file_mimetype: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('File', fileSchema);