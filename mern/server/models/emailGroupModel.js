const mongoose = require('mongoose');

//for list of emails share data with and list that have shared with them
const fileSchema = mongoose.Schema(
  {
    ownerEmail: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      enum: ['forOther', 'forMe', 'forBoxes'],
      required: true,
      trim: true
    },
    emailArray: [{
      type: String
    }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('emailGroup', fileSchema);