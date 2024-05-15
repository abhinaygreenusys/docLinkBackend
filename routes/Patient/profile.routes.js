const express = require("express");

const PatientProfileController = require("../../controllers/Patient/profile.controller");


const router = express.Router();

router.get("/", PatientProfileController.getProfile);
router.put("/", PatientProfileController.updateProfile);
router.put("/changepassword", PatientProfileController.changePassword);
router.patch("/updateDeviceToken",PatientProfileController.updateDeviceToken);
router.get("/logout", patientAccountController.logOut);


module.exports = router;
