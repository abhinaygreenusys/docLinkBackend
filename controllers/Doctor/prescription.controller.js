const patientPrescriptionsModel = require("../../models/PatientPrescriptions.model");
const patientModel = require("../../models/Patient.model");
const NotificationModel = require("../../models/Notification.model");
const cronJobModel = require("../../models/cronJob.model");
const sendNotification = require("../../utils/sendNotification.utils");
const createCronjob = require("../../utils/cronJobs.utils");
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



// routes.addPrescription = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const user = await patientModel.findById(id);
//     const deviceToken = user.deviceToken;

//     if (!user) {
//       return res.status(404).json({ error: "Patient not found" });
//     }

//     const { medicines, exercises, diet, refrainFrom, note, data } = req.body;

//     console.log(req.body);

//     const prescription = await patientPrescriptionsModel.create({
//       user: id,
//       medicines,
//       exercises,
//       diet,
//       refrainFrom,
//       note,
//     });

//     // user.cronJobs;

//     if (medicines) {
//       medicines.forEach(async (medicine) => {
//         const cronModel = {
//           schedule: "*/20 * * * * *",
//           tasks: {
//             prescription: prescription._id,
//             taskType: "medicine",
//             name: medicine.name,
//             dosage: medicine.dosage,
//           },
//           cronJobId: "",
//         };

//         cronModel.cronJobId = createCronjob.createCronjob({
//           schedule: cronModel.schedule,
//           task: cronModel.tasks,
//           deviceToken,
//         });

//         console.log("cronModel=", cronModel.cronJobId);

//         const cronJob = await cronJobModel.create(cronModel);
//         user.cronJobs.push(cronJob._id);
//       });
//     }
//     if (exercises) {
//       exercises.forEach(async (exercise) => {
//         const cronModel = {
//           schedule: "*/40 * * * * *",
//           tasks: {
//             prescription: prescription._id,
//             taskType: "exercise",
//             name: exercise?.name,
//             instructions: exercise?.instructions,
//             partOfDay: exercise?.partOfDay,
//           },
//           cronJobId: "",
//         };

//         cronModel.cronJobId = createCronjob.createCronjob({
//           schedule: cronModel.schedule,
//           task: cronModel.tasks,
//           deviceToken,
//         });

//         const cronJob = await cronJobModel.create(cronModel);
//         user.cronJobs.push(cronJob._id);
//       });
//     }

//     if (diet) {
//       diet.forEach(async (d) => {
//         const cronModel = {
//           schedule: " */1 * * * *",
//           tasks: {
//             prescription: prescription._id,
//             taskType: "diet",
//             name: d?.name,
//             partOfDay: d?.partOfDay,
//           },
//           cronJobId: "",
//         };

//         cronModel.cronJobId = createCronjob.createCronjob({
//           schedule: cronModel.schedule,
//           task: cronModel.tasks,
//           deviceToken,
//         });

//         const cronJob = await cronJobModel.create(cronModel);
//         user.cronJobs.push(cronJob._id);
//       });
//     }

//     user.prescriptions.push(prescription?._id);
//     await user.save();

//     const notificationMessage = "New Prescriptions Added ";

//     // const notify = await sendNotification({
//     //   type: "prescriptions",
//     //   typeId: prescription?._id,
//     //   body: notificationMessage,
//     //   data: data,
//     //   deviceToken,
//     // });

//     const notificationRes = await NotificationModel.create({
//       type: "prescriptions",
//       typeId: prescription?._id,
//       body: notificationMessage,
//       data: data,
//     });

//     user.unReadNotifications.push(notificationRes._id);

//     await user.save();

//     res
//       .status(201)
//       .json({ msg: "Prescription created successfully", result: prescription });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       error: "Internal Server Error",
//       errorDev: error.message,
//     });
//   }
// };



routes.addPrescription = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await patientModel.findById(id);
    const deviceToken = user.deviceToken;

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

    user.cronJobs = [];
    const tempArr = [];

    if (diet) {
      diet.forEach(async (item) => {
        const cronModel = {
          schedule: "*/15 * * * * * *",
          tasks: {
            prescription: prescription._id,
            taskType: "diet",
            name: item?.name,
            instructions: item?.instructions || null,
            partOfDay: item?.partOfDay,
          },
          cronJobId: "",
        };

        cronModel.cronJobId = createCronjob.createCronjob({
          schedule: cronModel.schedule,
          task: cronModel.tasks,
          deviceToken,
        });

        user.cronJobs.push( cronModel.cronJobId);
        const cronJob = await cronJobModel.create(cronModel);
      });
    }

    if (medicines) {
      medicines.forEach(async (medicine) => {
        const cronModel = {
          schedule: "*/20 * * * * *",
          tasks: {
            prescription: prescription._id,
            taskType: "medicine",
            name: medicine.name,
            dosage: medicine.dosage,
          },
          cronJobId: "",
        };

        cronModel.cronJobId = createCronjob.createCronjob({
          schedule: cronModel.schedule,
          task: cronModel.tasks,
          deviceToken,
        });

        user.cronJobs.push( cronModel.cronJobId);
        const cronJob = await cronJobModel.create(cronModel);

      });
    }

    if (exercises) {
      exercises.forEach(async (exercise) => {
        const cronModel = {
          schedule: "*/40 * * * * *",
          tasks: {
            prescription: prescription._id,
            taskType: "exercise",
            name: exercise?.name,
            instructions: exercise?.instructions,
            partOfDay: exercise?.partOfDay,
          },
          cronJobId: "",
        };

        cronModel.cronJobId = createCronjob.createCronjob({
          schedule: cronModel.schedule,
          task: cronModel.tasks,
          deviceToken,
        });
      
        user.cronJobs.push( cronModel.cronJobId);
        const cronJob = await cronJobModel.create(cronModel);

    })
  }

    user.prescriptions.push(prescription?._id);
    await user.save();


    const notificationMessage = "New Prescriptions Added ";

    const notify = await sendNotification({
      type: "prescriptions",
      typeId: prescription?._id,
      body: notificationMessage,
      data: data,
      deviceToken,
    });

    const notificationRes = await NotificationModel.create({
      type: "prescriptions",
      typeId: prescription?._id,
      body: notificationMessage,
      data: data,
    });

    user.unReadNotifications.push(notificationRes._id);

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
