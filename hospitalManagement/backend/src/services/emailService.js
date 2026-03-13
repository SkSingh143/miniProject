const nodemailer = require('nodemailer');
const { EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS } = require('../config/env');

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE, // e.g., 'gmail'
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: EMAIL_USER,
      to,
      subject,
      text,
    };
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
  }
};

module.exports = { sendEmail };