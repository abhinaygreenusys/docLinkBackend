const mongoose = require("mongoose");

// Define the schema for the Cronjob
const CronJobSchema = new mongoose.Schema({
  schedule: {
    type: String,
    required: true,
  },
  tasks: {
    type: {
      name: {type:String},
      dosage: {type: String},
      instructions: {type: String},
      partOfDay: {type: String},
    },
    required:true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create a model for the schema
module.exports = mongoose.model("CronJob", CronJobSchema);
