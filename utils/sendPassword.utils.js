const nodemailer = require("nodemailer");

const emailTemplateVerifyAccount = (name, password) => {
  return `<div>
    <p>Dear ${name},</p>
    <p>We have received a request for Creating your password. Please use the following Password to proceed:</p>
    <h2>${password}</h2>
    <p>If you did not request this, please ignore this email.</p>
    <p>If you have any questions or concerns, please contact our support team at <a href="mailto:${process.env.SUPPORT_MAIL}">${process.env.SUPPORT_MAIL}</a>.</p>
    <p>Thank you!</p>
    <p>Best regards,</p>
</div>`;
};

const sendPassword = async (email, name, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_EMAIL,
      to: email,
      subject: "Your Password",
      html: emailTemplateVerifyAccount(name, otp),
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendPassword;
