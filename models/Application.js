const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  applicantId: {
    type: String,
    // required: true,
  },
  jobId: {
    type: String,
    // required: true,
  },
  // video: {
  //   data: Buffer,
  //   contentType: String,
  // },
  videoDest: { type: String },
  status: {
    type: String,
    enum: ["hired", "applied", "on-hold"],
    // required: true,
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
