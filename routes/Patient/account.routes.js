const express = require("express");

const patientAccountController = require("../../controllers/Patient/account.controller");

const router = express.Router();

router.post("/register", patientAccountController.register);
router.post("/login", patientAccountController.login);
router.post("/verifyAccount", patientAccountController.verifyAccount);
router.post("/forgotPassword", patientAccountController.forgotPassword);
router.post("/resetPassword", patientAccountController.resetPassword);
router.post("/refreshAccessToken", patientAccountController.refreshAccessToken);

module.exports = router;
