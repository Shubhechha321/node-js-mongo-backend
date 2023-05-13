const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    max: 500,
  },
  desc: {
    type: String,
    max: 500,
  },
  about: {
    type: String,
  },
  responsibilities: {
    type: Array,
    max: 1000,
  },
  requirements: {
    type: Array,
    max: 1000,
  },
  url: {
    type: String,
  },
  question: {
    type: String,
    default: "Introduce yorself",
  },
  applicants: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Job", JobSchema);
