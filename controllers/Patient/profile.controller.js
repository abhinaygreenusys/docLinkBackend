const bcrypt = require("bcryptjs");
const cron=require("node-cron");
const patientModel = require("../../models/Patient.model");
const { createCronjob } = require("../../utils/cronJobs.utils");

const routes = {};

routes.getProfile = async (req, res) => {
  try {
    const { patientId } = req;

    const patient = await patientModel.findById(patientId);

    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.status(200).json({ result: patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.updateProfile = async (req, res) => {
  try {
    const { patientId } = req;
    const { name, phone } = req.body;

    const patient = await patientModel
      .findByIdAndUpdate(patientId, { name, phone }, { new: true })
      .select("-password");

    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.status(200).json({ result: patient });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.changePassword = async (req, res) => {
  try {
    const { patientId } = req;
    const { oldPassword, newPassword } = req.body;

    const patient = await patientModel.findById(patientId);

    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const isMatch = await bcrypt.compare(oldPassword, patient.password);

    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    patient.password = hashedPassword;

    await patient.save();

    res.status(200).json({ result: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.updateDeviceToken = async (req, res) => {
  const { patientId } = req;
  const { deviceToken } = req.body;
  console.log(req.body);
  console.log(patientId)
  const patient = await patientModel.findByIdAndUpdate(
    patientId,
    { deviceToken: deviceToken },
    { new: true }
  );
  if (!patient) return res.status(404).send({ error: "!patient not found" });
  res.status("200").json(patient);
};


routes.logOut = async (req, res) => {
  const {patientId}=req;
  console.log("logout=",patientId)
  const patient=await patientModel.findById(patientId,{deviceToken:1}).populate("cronJobs");
  const allCrons=cron.getTasks()
    // console.log(allCrons);
    allCrons.forEach((value,key)=>{
      console.log(`${key} = ${value}`);
    });
  // patient.deviceToken=null;
  console.log(patient);
  res.status(200).json("logout"); 
  // createCronjob.removeCron();
};


module.exports = routes;
