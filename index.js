const dotenv = require("dotenv");
dotenv.config();

const expressConnection = require("./connections/express.connection");
const mongoConnection = require("./connections/mongo.connection");
const sendNotification = require("./utils/sendNotification.utils");

mongoConnection()
  .then(() => expressConnection())
  .catch((err) => console.log(err));
  // sendNotification()

