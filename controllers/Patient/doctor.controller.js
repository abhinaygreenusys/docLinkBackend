const doctorModel = require("../../models/Doctor.model");
const prescriptionModel = require("../../models/PatientPrescriptions.model");

const routes = {};

routes.getDoctorDetails = async (req, res) => {
  try {
    const Doctor = await doctorModel.find();
    const noofpaient = await prescriptionModel.distinct("user");

    const mydoc = Doctor[0];

    const data = {
      qualification: mydoc.qualifications,
      experience: mydoc.experience,
      email: mydoc.email,
      phone: mydoc.phone,
      visitingHours: mydoc.workingHours,
      noofpaient: noofpaient.length,
    };

    res.status(200).json({ result: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

module.exports = routes;
