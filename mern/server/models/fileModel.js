const mongoose = require('mongoose');

//add user id in schema
const fileSchema = mongoose.Schema(
  {
    //fileOwner
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
      require: true
    },
    path: {
      type: String,
      required: true
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