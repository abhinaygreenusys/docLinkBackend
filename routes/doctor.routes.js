const express = require("express");

const accountRoutes = require("./Doctor/account.routes");
const profileRoutes = require("./Doctor/profile.routes");
const patientRoutes = require("./Doctor/patient.routes");
const prescriptionRoutes = require("./Doctor/prescription.routes");

const router = express.Router();

router.use("/", accountRoutes);
router.use("/", profileRoutes);
router.use("/patient", patientRoutes);
router.use("/patient", prescriptionRoutes);

module.exports = router;