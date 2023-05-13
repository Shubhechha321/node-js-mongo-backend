const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

module.exports = {
  //get a user
  getUser: async (req, res) => {
    try {
      console.log("user", req.params);
      const user = await User.findById(req.params.id); // not sending password and updatedAt
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  getVid: async (req, res) => {
    const { job_id } = req.params; // get the jobid from the request parameters

    try {
      const user = await User.findOne({ "applications.jobid": job_id }); // find the user with the jobid in their applications array

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const application = user.applications.find((app) => app.jobid === job_id); // find the application with the jobid in the user's applications array
      const videodest = application ? application.videodest : null;
      // get the videodest for the application, or null if the application doesn't exist
      const filename = application ? application.filename : null;
      return res.status(200).json({ videodest, filename });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Server error" });
    }
  },
  getRole: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const role = user.role;
      res.status(200).json(role);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get all jobs
  updateUser: async (req, res) => {
    //   if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
    //   } else {
    //     return res.status(403).json("You can update only your account!");
    //   }
  },
};
