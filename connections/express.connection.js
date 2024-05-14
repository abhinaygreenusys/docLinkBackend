const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const doctorRoutes = require("../routes/doctor.routes");
const patientRoutes = require("../routes/patient.routes");

app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);

app.use("/test", (req, res) => {
  res.send("Hello World!");
});

app.use("/", (req, res) => {
  return res.send("working");
});

app.get("*", (req, res) => {
  res.status(404).json("invalid request");
});

const startserver = () => {
  try {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = startserver;
