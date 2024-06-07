const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      ciphers: "SSLv3",
    },
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Mail başarıyla gönderildi:", info);
    return true;
  } catch (error) {
    console.error("Mail gönderilemedi:", error);
    throw new Error("Mail gönderimi başarısız oldu");
  }
};

module.exports = sendEmail;
