const Job = require("../models/Job");
const User = require("../models/User");
// const fileUpload = require("express-fileupload");
const { getUserId } = require("../routes/token_validation");
const Application = require("../models/Application");

const multer = require("multer");

//create an applicant
module.exports = {
  // get all applicants
  getApplicants: async (req, res) => {
    try {
      const job = await Job.findById(req.params.job_id);
      const applicantIds = job.applicants;
      const applicants = await User.find({ _id: { $in: applicantIds } });
      res.status(200).json(applicants);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // create a new job
  createApplication: async (req, res) => {
    const newApplication = new Application(req.body);
    try {
      const savedApplication = await newApplication.save();
      res.status(200).json(savedApplication);
    } catch (err) {
      res.status(500).json(err);
    }
    // const { applicantId, jobId, status } = req.body;
    // const { buffer, mimetype } = req.files.video;

    // try {
    //   const application = new Application({
    //     applicantId,
    //     jobId,
    //     video: {
    //       data: buffer,
    //       contentType: mimetype,
    //     },
    //     status,
    //   });

    //   await application.save();

    //   res.status(201).json({ message: "Application saved successfully" });
    // } catch (err) {
    //   console.error(err);
    //   res.status(500).json({ message: "Server error" });
    // }
  },

  //update a job

  updateJob: async (req, res) => {
    try {
      const job = await Job.findById(req.params.job_id);
      if (job.userId === req.body.userId) {
        await job.updateOne({ $set: req.body });
        res.status(200).json("the post has been updated");
      } else {
        res.status(403).json("you can update only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //delete a job
  deleteJob: async (req, res) => {
    try {
      const post = await Job.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("the post has been deleted");
      } else {
        res.status(403).json("you can delete only your post");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //get a job

  getJob: async (req, res) => {
    try {
      const job = await Job.findById(req.params.job_id);
      res.status(200).json(job);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
