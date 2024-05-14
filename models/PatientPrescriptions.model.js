const mongoose = require("mongoose");

const PatientPrescriptionsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    medicines: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          dosage: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
    exercises: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          instructions: {
            type: String,
            required: true,
          },
          partOfDay: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
    diet: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          partOfDay: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
    },
    refrainFrom: {
      type: String,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "PatientPrescriptions",
  PatientPrescriptionsSchema
);
