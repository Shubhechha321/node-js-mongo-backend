const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sign, verify } = require("jsonwebtoken");

//REGISTER
module.exports = {
  register: async (req, res) => {
    try {
      //generate new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      //create new user
      const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
      });

      //save user and respond
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  //LOGIN
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      !user && res.status(404).json("user not found");
      const result = bcrypt.compareSync(req.body.password, user.password);
      console.log("result: ", result);
      if (result) {
        user.password = undefined;
        const accessToken = sign({ result: user }, process.env.JSON_KEY, {
          expiresIn: "1h",
        });
        const refreshToken = sign(
          { result: user },
          process.env.JSON_REFRESH_KEY,
          {
            expiresIn: "7d",
          }
        );
        return res.json({
          success: 1,
          message: "Logged in successfully",
          role: user.role,
          accessToken,
          refreshToken,
        });
      } else {
        res.status(404);
        return res.json({
          message: "Wrong password",
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  renewAccessToken: (req, res) => {
    refreshToken = req.params.refresh_token;
    if (!refreshToken) {
      return res.status(404).json({ message: "Not authenticated" });
    }
    verify(refreshToken, process.env.JSON_REFRESH_KEY, (err, decoded) => {
      if (err) {
        return res.json({
          success: 0,
          message: "Invalid Refresh Token...",
        });
      } else {
        const accessToken = sign({ result: decoded }, process.env.JSON_KEY, {
          expiresIn: "1h",
        });
        return res.status(201).json({
          accessToken,
        });
      }
    });
  },

  logout: (req, res) => {
    return res.json({
      message: "You have been logged out successfully.",
    });
  },
};
