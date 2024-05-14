const express = require("express");
const auth = require("../../middlewares/doctor.auth");
const doctorPatientController = require("../../controllers/Doctor/patient.controller");

const router = express.Router();

router.get("/", auth, doctorPatientController.getPatients);
router.post("/", auth, doctorPatientController.addPatient);
router.get("/statuses", auth, doctorPatientController.statuses);
router.delete("/:id", auth, doctorPatientController.deletePatient);
router.get("/:id", auth, doctorPatientController.getPatient);
router.patch("/:id", auth, doctorPatientController.updatePatient);

module.exports = router;
