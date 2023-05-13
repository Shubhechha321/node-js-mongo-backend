const {
  updateUser,
  getUser,
  getVid,
  getRole,
} = require("../controllers/user.controller");
const { checkToken } = require("../routes/token_validation");
const router = require("express").Router();

router.get("/:id", getUser);
router.get("role/:id", getRole);
router.put("/:id", updateUser);
router.get("/:job_id/videodest", getVid);
module.exports = router;
