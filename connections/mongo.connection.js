const mongoose = require("mongoose");

const CONNECTION_URL = process.env.MONGODB_URI || "";

// const CONNECTION_URL="mongodb+srv://mohit:tvZ0pRHsVUGsgRTu@testingbanking.guelwy7.mongodb.net/DocLink?retryWrites=true&w=majority"

const connectDB = async () => {
  try {
    await mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    // console.log(error);
    throw error
  }
};

module.exports = connectDB;
