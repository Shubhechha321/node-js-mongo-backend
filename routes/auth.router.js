const {
  register,
  login,
  logout,
  renewAccessToken,
} = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/:refresh_token", renewAccessToken);

module.exports = router;
