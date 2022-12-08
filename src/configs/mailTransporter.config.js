const nodemailer = require("nodemailer");
const {
  SMTP_MAIL_HOST,
  SMTP_MAIL_PORT,
  SMTP_MAIL_USERNAME,
  SMTP_MAIL_PASSWORD,
} = require("./index");

let transporter = nodemailer.createTransport({
  host: SMTP_MAIL_HOST,
  port: SMTP_MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_MAIL_USERNAME, // generated ethereal user
    pass: SMTP_MAIL_PASSWORD, // generated ethereal password
  },
});

module.exports = transporter;
