const patientModel = require("../../models/Patient.model");
const bcrypt = require("bcryptjs");

const sendPassword = require("../../utils/sendPassword.utils");

const routes = {};

routes.addPatient = async (req, res) => {
  try {
    const { name, email, phone, dob, status, note } = req.body;

    // Check if patient already exists
    const patientExist = await patientModel.findOne({ email });

    if (patientExist)
      return res
        .status(400)
        .json({ error: "Patient with this email already exists" });

    // Create Random Password
    const password = Math.random().toString(36).slice(-8);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const patient = await patientModel.create({
      name,
      email,
      phone,
      dob,
      status,
      note,
      isVerifiy: true,
      password: hashedPassword,
    });

    // Send pass to email
    sendPassword(email, name, password);

    res.status(201).json({ msg: "Patient added successfuly", result: patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.getPatients = async (req, res) => {
  const { page = 1, status = "all", searchText = "" } = req.query;
  try {
    // if status is all then get all patients (also some paintent does not have status)

    const options = {
      isDeleted: false,
      status,
      $or: [
        { name: { $regex: searchText, $options: "i" } },
        { email: { $regex: searchText, $options: "i" } },
        { phone: { $regex: searchText, $options: "i" } },
      ],
    };

    if (status === "all") delete options.status;

    //  total pages
    const totalPatients = await patientModel.countDocuments(options);
    const totalPages = Math.ceil(totalPatients / 10);

    const patients = await patientModel
      .find(options)
      .select("-password -isDeleted ")
      .sort({ updatedAt: -1 })
      .limit(10)
      .skip((page - 1) * 10);

    res.status(200).json({ msg: "Success", totalPages, result: patients });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.deletePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await patientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    patient.isDeleted = true;
    await patient.save();

    res.status(200).json({ msg: "Patient deleted successfuly" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.getPatient = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await patientModel.findById(id, {
      isDeleted: 0,
      password: 0,
    });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.status(200).json({ msg: "Success", result: patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.updatePatient = async (req, res) => {
  const { id } = req.params;
  try {
    const { status, note } = req.body;

    const patient = await patientModel.findByIdAndUpdate(
      id,
      { status, note },
      {
        new: true,
      }
    );

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res
      .status(200)
      .json({ msg: "Patient details updated successfuly", result: patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.statuses = async (req, res) => {
  try {
    const statuses = await patientModel
      .find({ isDeleted: false })
      .distinct("status");

    res.status(200).json({ msg: "Success", result: statuses });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

module.exports = routes;
