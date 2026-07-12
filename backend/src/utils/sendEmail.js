const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const sendEmail = async ({ email, subject, message, attachments }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // App Password mapping
      },
    });

    const mailOptions = {
      from: `"ShopNest Support" <${process.env.GMAIL_USER}>`,
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
