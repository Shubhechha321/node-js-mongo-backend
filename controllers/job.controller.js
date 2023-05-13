const Job = require("../models/Job");
const User = require("../models/User");
const { getUserId } = require("../routes/token_validation");

module.exports = {
  // get all jobs
  getJobs: async (req, res) => {
    try {
      const jobs = await Job.find();
      res.status(200).json(jobs);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new job
  createJob: async (req, res) => {
    const newJob = new Job(req.body);
    const user = await User.findById(req.body.userId);
    console.log("user details", user.role);
    if (user.role === "recruiter") {
      try {
        const savedJob = await newJob.save();
        res.status(200).json(savedJob);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cannot add jobs");
      console.log("user", user);
    }
  },

  //update a job
  getRecruiterJobs: async (req, res) => {
    try {
      const jobs = await Job.find({ userId: req.params.user_id });
      res.status(200).json(jobs);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  updateJob: async (req, res) => {
    try {
      const job = await Job.findById(req.params.job_id);
      // if (job.userId === req.body.userId) {
      await job.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
      // } else {
      //   res.status(403).json("you can update only your post");
      // }
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
