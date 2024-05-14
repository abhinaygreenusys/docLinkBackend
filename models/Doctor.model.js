const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      default: ''
    },
    workingHours: {
      type: String,
      default: ''
    },
    qualifications: {
      type: [
        {
          degree: {
            type: String,
            required: true,
          },
          passingYear: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
