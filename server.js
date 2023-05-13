const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user.router");
const authRoute = require("./routes/auth.router");
const jobRoute = require("./routes/job.router");
const { checkToken } = require("./routes/token_validation");
var multer = require("multer");
dotenv.config();
const path = require("path");

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var uploadPath = path.resolve(__dirname, "uploads");
    console.log("Destination Folder: " + uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage }).single("file");

//middleware
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// app.use(express.json());
// app.use(fileUpload());
app.use(helmet());
app.use(morgan("common"));

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use("/test", (req, res) => {
  res.json({ message: "Hello Vercel" });
});

app.post("/api/upload", function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("firsterror lk", err);
      return res.status(500).json(err);
    } else if (err) {
      console.error("second", err);
      return res.status(500).json(err);
    }
    if (!req.file) {
      console.error("File not uploaded");
      return res.status(500).json({ message: "File not uploaded" });
    }
    console.log(req.file);
    return res.status(200).send(req.file);
  });
});
app.use(
  "/uploads",
  express.static("D:\\be project\\backend\\node-js-mongo-backend\\uploads")
);

app.use("/api/auth", authRoute);
// app.use("/api/users", checkToken, userRoute);
app.use("/api/users", userRoute);
app.use("/api/jobs", jobRoute);

app.listen(8800, () => {
  console.log("Backend server is running!");
});

// eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZmQ5ZDNjOWIwZDViY2I0YjMwZDZiNDA2NzBkYjY0NDQyMmU2M2FhMDFhZmUzOTFmNWE4YjJhMjkzZDBiZTlhNmE4MzVhNGYxOTVhNTU0ZjQiLCJpYXQiOjE2ODM4MjYwMDAuMTgwNzAxLCJuYmYiOjE2ODM4MjYwMDAuMTgwNzAyLCJleHAiOjQ4Mzk0OTk2MDAuMTc0ODE2LCJzdWIiOiI2MjMxMzYyMCIsInNjb3BlcyI6WyJ1c2VyLnJlYWQiLCJ1c2VyLndyaXRlIiwidGFzay5yZWFkIiwidGFzay53cml0ZSIsIndlYmhvb2sucmVhZCIsIndlYmhvb2sud3JpdGUiLCJwcmVzZXQucmVhZCIsInByZXNldC53cml0ZSJdfQ.D8I_ALvAASqz2IMzl35zHwysgMRGGjzl3cxo4zQpdiqjujO8mvkuqMuDiZe5iKGXUokwnWiYWVV1yQeobXzsEy2BJGna-7-BXIoYH-IfAv9mftCJWX3rGSCvHsIm746EGmLnncNhE16pEzmJQsipgjHzNN7_TeqlLnvKiLNFVLT9Gz0y6UQiMfXPI8i1h3EwJ2eBMnl1ivjoynZVCTWrxnvcFWVuwM7rOcRU2nliXcv7EojZYzYlefHHMusaCNToDg7brnDDqCjuRmU5SE-V1c4WG719pnqKeI6NQP6CXYu3K2wRQJO0hEkj9dL5-i2w9TKMuOHEuHjBX7TBlrS6KeeyhCdtRBW1VSPlKQb33MrNxUQ28kJotO4RkN1lcakQE46Wvj6C5SYgcXLPDh_o-eKBTQ7hQw1gEUVeaEWmMwWBvINenjQbSF7Jzc4Afos5wIhyjG8uTufDn5XiCR8sQwpMILuxCmUn6pG2pZt_NVIq5ke4e2dwqq6nqTwiO3yjw5i9WN2eB_rjLNwDw6Bqu4XqcXR-EMJYSZJ7-mBbN8RZON0fK4nFMd4YE3BeFxbz7J2aVlUB3CZAW9vDnJ8-KbYH81zmvglGsV0WxEB52ESO4Sjwti8AOh3BkK64Nmwji-YKQWR4v5YXOZEGTqyIfISOM2oaHrV2SI83emY7-TM
