const mongoose = require("mongoose");

// Define the schema for the Cronjob
const CronJobSchema = new mongoose.Schema({
  schedule: {
    type: String,
    required: true,
  },
  cronJobId:{
    type: String,
    default:""
  },
  tasks: {
    type: {
      taskType:{type:String},
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
