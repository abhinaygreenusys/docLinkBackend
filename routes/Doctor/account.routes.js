const express = require("express");
const auth = require("../../middlewares/doctor.auth");
const doctorAccountController = require("../../controllers/Doctor/account.controller");

const router = express.Router();

router.post("/register", doctorAccountController.register);
router.post("/login", doctorAccountController.login);
router.post("/refreshAccessToken", doctorAccountController.refreshAccessToken);

module.exports = router;
