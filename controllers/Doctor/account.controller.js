const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const doctorModel = require("../../models/Doctor.model");

const routes = {};

routes.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const doctorExist = await doctorModel.findOne({ email });

    if (doctorExist)
      return res.status(400).json({ error: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = await doctorModel.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ msg: "Account created successfuly", result: doctor });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error",
      errorDev: error.message,
    });
  }
};

routes.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await doctorModel.findOne({ email });
    if (!doctor) return res.status(404).json({ error: "Account not found" });

    const validPassword = await bcrypt.compare(password, doctor.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    const resfreshToken = jwt.sign(
      { id: doctor._id },
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      {
        expiresIn: "1y",
      }
    );

    res.status(200).json({ msg: "Logged in successfuly", result: { token, resfreshToken } });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", errorDev: error.message });
  }
};

routes.refreshAccessToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken)
    return res.status(404).send({ error: "Access denied, refresh-token missing!" });

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY
    );

    const id = decoded.id;
    const accessToken = jwt.sign({ id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
     res.status(201).send({
      msg: "success",
      result: accessToken,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(422)
      .send({ error: "Invalid refresh token", errorDev: e.message });
  }
};

module.exports = routes;
