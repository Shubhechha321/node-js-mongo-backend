const {
  createApplication,
  getApplicants,
} = require("../controllers/applicant.controller");
const {
  createJob,
  getJobs,
  getJob,
  deleteJob,
  updateJob,
  getRecruiterJobs,
} = require("../controllers/job.controller");
const { checkToken } = require("../routes/token_validation");
const router = require("express").Router();

// jobs
router.post("/", createJob);
router.get("/", getJobs);
router.get("/:job_id", getJob);
router.put("/:job_id", updateJob);
router.get("/recruiter/:user_id", getRecruiterJobs);

// applicants
const multer = require("multer");
const uuidv4 = require("uuid/v4");
const DIR = "./public/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});
var upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/webm" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .mp4, .jpg and .jpeg format allowed!"));
    }
  },
});
// router.post(
//   "/:job_id/application",
//   upload.single("videoUrl"),
//   (req, res, next) => {
//     const url = req.protocol + "://" + req.get("host");
//     const application = new Application({
//       _id: new mongoose.Types.ObjectId(),
//       applicantId: req.body.applicantId,
//       jobId: req.body.jobId,
//       videoUrl: url + "/public/" + req.file.filename,
//       status: req.body.status,
//     });
//     application
//       .save()
//       .then((result) => {
//         res.status(201).json({
//           message: "User registered successfully!",
//           userCreated: {
//             _id: result._id,
//             videoUrl: result.videoUrl,
//           },
//         });
//       })
//       .catch((err) => {
//         console.log(err),
//           res.status(500).json({
//             error: err,
//           });
//       });
//   }
// );
router.get("/:job_id/applicants", getApplicants);
router.post("/:job_id/application", createApplication);
// router.get("/:job_id/applicants", getApplicants);
// router.get("/:job_id/applicants/:applicant_id", getApplicantByApplicantId);
// router.put(
//   "/:job_id/applicants/:applicant_id",
//   findUserFromApplicant,
//   updateApplicant
// );
// router.delete(
//   "/:job_id/applicants/:applicant_id",
//   findUserFromApplicant,
//   deleteApplicant
// );

module.exports = router;
