const { SMTP_MAIL_EMAIL } = require("../configs");
const transporter = require("../configs/mailTransporter.config");

const mailHelper = async (options) => {
  const message = {
    from: SMTP_MAIL_EMAIL, // sender email address
    to: options.email, // receivers email address
    subject: options.subject, // subject line
    text: options.text, // plain text
  };

  await transporter.sendMail(message);
};

module.exports = mailHelper;
