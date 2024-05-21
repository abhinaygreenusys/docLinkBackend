const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    note: {
      type: String,
    },
    isVerifiy: {
      type: Boolean,
      default: false,
    },
    isPayment:{
      type:Boolean,
      default:false
    },
    paymentExpire:{
       type:Date
    },
    verificcationCode: {
      type: Number,
    },
    codeExpire: {
      type: Date,
    },
    prescriptions: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "PatientPrescriptions",
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    readNotifications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Notification",
      default: [],
    },

    unReadNotifications: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Notification",
      default: [],
    },

    cronJobs: {
      type: [String],
      // ref: "CronJob",
      default: [],
    },
    deviceToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", PatientSchema);
