const doctorModel = require("../../models/Doctor.model");
const patientModel = require("../../models/Patient.model");
const patientPrescriptionModel = require("../../models/PatientPrescriptions.model");
const bcrypt = require("bcryptjs");

const routes = {};

routes.getProfile = async (req, res) => {
  const id = req.userId;
  try {
    const doctor = await doctorModel.findById(id);
    res.status(200).json({ msg: "Success", result: doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.updateProfile = async (req, res) => {
  const id = req.userId;
  const {
    name,
    experience,
    workingHours,
    qualifications,
    password,
    newPassword,
  } = req.body;
  let updateFields = { name, experience, workingHours, qualifications };
  try {
    const doctor = await doctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      updateFields.password = hashedPassword;
    }

    const newdoctor = await doctorModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });

    res.status(200).json({ msg: "Updated", result: newdoctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.getDashboard = async (req, res) => {
  try {
    // return count of all patients, patients by status, patients by month
    const patients = await patientModel.find({
      isDeleted: false,
      isVerifiy: true,
    });
    const prescriptions = await patientPrescriptionModel.find();
    const statuses = [...new Set(patients.map((patient) => patient.status))];
    const patientsByStatusCount = {};
    statuses.forEach((status) => {
      patientsByStatusCount[status] = patients.filter(
        (patient) => patient.status === status
      ).length;
    });
    const patientsByMonthCount = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setMonth(today.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthPatients = patients.filter(
        (patient) =>
          new Date(patient.createdAt).getMonth() === month &&
          new Date(patient.createdAt).getFullYear() === year
      );
      const monthName = date.toLocaleString("default", { month: "short" });
      const shortYear = year.toString().substr(-2);
      const monthData = {
        name: `${monthName}'${shortYear}`,
        total: monthPatients.length,
      };
      statuses.forEach((status) => {
        monthData[status] = monthPatients.filter(
          (patient) => patient.status === status
        ).length;
      });
      patientsByMonthCount.push(monthData);
    }
    res.status(200).json({
      msg: "Success",
      result: {
        totalPatients: patients.length,
        patientsByStatusCount,
        patientsByMonthCount: patientsByMonthCount.reverse(),
        totalPrescriptions: prescriptions.length,
        statuses,
      },
    });

    // const totalPatients = await patientModel.countDocuments({ isDeleted: false });
    // const patientsByStatusCount = await patientModel.aggregate([
    //   {
    //     $match: { isDeleted: false },
    //   },
    //   {
    //     $group: {
    //       _id: "$status",
    //       count: { $sum: 1 },
    //     },
    //   },
    // ]);
    // const patientsByMonthCount = await patientModel.aggregate([
    //   {
    //     $match: { isDeleted: false },
    //   },
    //   {
    //     $group: {
    //       _id: {
    //         month: { $month: "$createdAt" },
    //         year: { $year: "$createdAt" },
    //       },
    //       count: { $sum: 1 },
    //     },
    //   },
    // {
    //   $project: {
    //     _id: 0,
    //     month: { $monthToString: { format: "%b", date: "$_id.month" } },
    //     year: { $year: "$_id.year" },
    //     count: 1,
    //   },
    // },
    //   {
    //     $sort: { year: 1, month: 1 },
    //   },
    // ]);
    // const totalPrescriptions = await patientPrescriptionModel.countDocuments();
    // const statuses = await patientModel.find({ isDeleted: false }).distinct("status");
    // res.status(200).json({
    //   msg: "Success",
    //   result: {
    //     totalPatients,
    //     patientsByStatusCount,
    //     patientsByMonthCount,
    //     totalPrescriptions,
    //     statuses,
    //   },
    // });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

module.exports = routes;
