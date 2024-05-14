
const express = require("express");

const PatientPrescriptionsController = require("../../controllers/Patient/prescription.controller");

const router = express.Router();

router.get("/", PatientPrescriptionsController.getPrescriptions);
router.get("/last", PatientPrescriptionsController.lastPrescription);
router.get("/:id", PatientPrescriptionsController.getPrescription);

module.exports = router;
