const NotificationModel = require("../../models/Notification.model");
const PatientModel = require("../../models/Patient.model");
const sendNotification = require("../../utils/sendNotification.utils");

const routes = {};

routes.getAllNotification = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const data = await NotificationModel.find();
    console.log("data=", data);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json(err);
  }
};

routes.getNotification = async (req, res) => {
  try {
    const { patientId } = req;
    console.log(req.params);
    const data = await PatientModel.findById(patientId, {
      readNotifications: 1,
      unReadNotifications: 1,
      _id: 0,
    })
      .populate("readNotifications")
      .populate("unReadNotifications");

    return res.status(200).json(data);
  } catch (err) {
    return res.status(404).json(err);
  }
};

routes.updateNotification = async (req, res) => {
  const { patientId } = req;
  const { notificationId } = req.body;
  const patient = await PatientModel.findById(patientId, {
    readNotifications: 1,
    unReadNotifications: 1,
  });
  

  const notification = patient.unReadNotifications.find(
    (unReadNotification) => unReadNotification._id.toString() === notificationId
  );
  patient.unReadNotifications = patient.unReadNotifications.filter(
    (unReadNotification) => unReadNotification._id.toString() !== notificationId
  );
  if (notification) notification.isRead = true;
  notification && patient.readNotifications.push(notification);
  let updatedPatient = await patient.save();
  updatedPatient=await (await updatedPatient.populate("readNotifications")).populate("unReadNotifications")
  console.log(updatedPatient);

  return res.status(200).json(patient);
};

module.exports = routes;
