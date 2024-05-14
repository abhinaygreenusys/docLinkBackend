const patientPrescriptionsModel = require("../../models/PatientPrescriptions.model");
const patientModel = require("../../models/Patient.model");
const NotificationModel = require("../../models/Notification.model");
const cronJobModel = require("../../models/cronJob.model");
const sendNotification = require("../../utils/sendNotification.utils");
const routes = {};

routes.getPatientPastPrescriptions = async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await patientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const patientPrescriptions = await patientPrescriptionsModel
      .find({ user: id })
      .sort({ createdAt: -1 });
    res.status(200).json({ msg: "Success", result: patientPrescriptions });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.addPrescription = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await patientModel.findById(id);

    if (!user) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const { medicines, exercises, diet, refrainFrom, note, data } = req.body;

    console.log(req.body);

    const prescription = await patientPrescriptionsModel.create({
      user: id,
      medicines,
      exercises,
      diet,
      refrainFrom,
      note,
    });

    // if (medicines) {
    //   medicines.forEach(async (medicine) => {
    //     const cronJob = await cronJobModel.create({
    //       name: medicine?.name,
    //       dosage: medicine?.dosage,
    //     });
    //     user.cronJobs.push(cronJob._id);  
    //   });
    // }
    // if (exercises) {
    //   exercises.forEach(async (exercise) => {
    //     const cronJob = await cronJobModel.create({
    //       name: exercise?.name,
    //       instructions: exercise?.instructions,
    //       partOfDay: exercise?.partOfDay,
    //     });
    //     user.cronJobs.push(cronJob._id);  
    //   });
    // }
    
    // if (diet) {
    //   diet.forEach(async (d) => {
    //     const cronJob = await cronJobModel.create({
    //       name: d?.name,
    //       partOfDay: d?.partOfDay,
    //     });
    //     user.cronJobs.push(cronJob._id);  
    //   });
    // }

    user.prescriptions.push(prescription?._id);

    const notificationMessage = "New Prescriptions Add ";

    const notify = await sendNotification({
      body:{
        type: "prescriptions",
        typeId:prescription?._id,
        message: notificationMessage,
        data: data,
        deviceToken: user.deviceToken
      }
    });

    const notificationRes = await NotificationModel.create({
      body:{
        type: "prescriptions",
        typeId:prescription?._id,
        message: notificationMessage,
        data: data,
      }
    }
    );

    user.unReadNotifications.push(notificationRes._id);
    // user.cronJobs.push();

    await user.save();

    res
      .status(201)
      .json({ msg: "Prescription created successfully", result: prescription });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.prescriptionSuggestion = async (req, res) => {
  try {
    const medicineSuggestion = await patientPrescriptionsModel.distinct(
      "medicines.name"
    );
    const exerciseSuggestion = await patientPrescriptionsModel.distinct(
      "exercises.name"
    );

    res.status(200).json({
      msg: "Success",
      result: {
        medicineSuggestion,
        exerciseSuggestion,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

module.exports = routes;
