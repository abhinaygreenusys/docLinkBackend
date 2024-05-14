const express = require("express");

const patientAccountController = require("../../controllers/Patient/account.controller");
const notificationController = require("../../controllers/Patient/notification.controller");

const router = express.Router();

// router.get("/",notificationController.getAllNotification);
router.get("/",notificationController.getNotification);
router.patch("/",notificationController.updateNotification);
// // router.post("/login", patientAccountController.login);
// router.post("/verifyAccount", patientAccountController.verifyAccount);
// router.post("/forgotPassword", patientAccountController.forgotPassword);
// router.post("/resetPassword", patientAccountController.resetPassword);
// router.post("/refreshAccessToken", patientAccountController.refreshAccessToken);

module.exports = router;
