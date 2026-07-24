const nodemailer = require("nodemailer");
const logger = require("../config/logger");
const config = require("../config/config");

const sendEmail = async ({ email, subject, message, attachments }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.gmail.user,
        pass: config.gmail.pass,
      },
    });

    const mailOptions = {
      from: `"ShopNest Support" <${config.gmail.user}>`,
      to: email,
      subject: subject,
      html: message,
      attachments: attachments || [],
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email successfully sent to ${email}`);
  } catch (error) {
    logger.error(`Failed to send email to ${email}: ${error.message}`);
  }
};

module.exports = sendEmail;
