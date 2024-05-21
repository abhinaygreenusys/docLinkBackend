const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const patientModel = require("../../models/Patient.model");
const prescriptionModel = require("../../models/PatientPrescriptions.model");

const routes = {};

routes.getPrescriptions = async (req, res) => {
  try {
    const { patientId } = req;

    console.log(patientId)

    const prescriptions = await prescriptionModel.find({ user: patientId });
    

    res.status(200).json({ result: prescriptions });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.getPrescription = async (req, res) => {
  const { id } = req.params;
  const { patientId } = req;
  try {
    const prescription = await prescriptionModel.findOne({
      _id: id,
      user: patientId,
    });

    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    res.status(200).json({ result: prescription });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.lastPrescription = async (req, res) => {
  try {
    const { patientId } = req;
    const { type } = req.query;

    // i want last prescription of patient
    //  type can be medicine , exercise , diet , note

    const prescription = await prescriptionModel
      .findOne({ user: patientId })
      .sort({ createdAt: -1 })
      .limit(1);
      
    if (!prescription) {
      return res.status(404).json({ error: "Prescription not found" });
    }

    if (type) {
      return res
        .status(200)
        .json({ result: prescription[type], data: prescription.createdAt });
    }

    res.status(200).json({ result: prescription });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

module.exports = routes;
