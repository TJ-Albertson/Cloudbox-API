const mongoose = require('mongoose');

//add user id in schema
const fileSchema = mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    size: {
      type: String, 
    },
    directory: {
      type: String,
      required: true
    },
    path: {
      type: String,
    },
    mimeType: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('File', fileSchema);