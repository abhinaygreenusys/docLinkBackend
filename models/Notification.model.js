const mongoose=require("mongoose");

// const mongoose = require('mongoose');

// Define the schema for the notification
const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  typeId: {
    type:mongoose.Schema.Types.ObjectId,
  },
  
  body: {
    type: String,
    required: true
  },
  data: {
    type: Object
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
});

// Create a model for the schema
module.exports = mongoose.model("Notification", NotificationSchema);

