import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async ({ email, name }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome to ShopNest",
    html: `<h2>Welcome ${name} 🎉</h2>
           <p>Thank you for joining ShopNest.</p>`,
  });
};
