const express = require("express");
const doctorProfileController = require("../../controllers/Doctor/profile.controller");

const auth = require("../../middlewares/doctor.auth");

const router = express.Router();

router.get("/profile", auth, doctorProfileController.getProfile);
router.put("/profile", auth, doctorProfileController.updateProfile);
router.get("/dashboard", auth, doctorProfileController.getDashboard);

module.exports = router;
