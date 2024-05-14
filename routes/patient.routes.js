const express = require("express");

const accountRoutes = require("./Patient/account.routes");
const profileRoutes = require("./Patient/profile.routes");
const prescriptionRoutes = require("./Patient/prescription.routes");
// const doctorRoutes = require("./Patient/doctor.routes");
const notificationRoutes = require("./Patient/notification.routes");

const patientAuth = require("../middlewares/patient.auth");
const { getDoctorDetails } = require("../controllers/Patient/doctor.controller");

const router = express.Router();

router.use("/", accountRoutes);
router.use("/profile", patientAuth, profileRoutes);
router.use("/prescription", patientAuth, prescriptionRoutes);
router.use("/doctor", getDoctorDetails);
// router.use("/notification", doctorRoutes);
router.use("/notification",patientAuth,notificationRoutes);



module.exports = router;
