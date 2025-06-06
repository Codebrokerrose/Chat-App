const nodemailer = require("nodemailer");

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.SECURE === "true", // convert string to boolean
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });

    console.log(`✅ Email sent successfully to: ${email}`);
    return info; // optional: you can return info if needed
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error; // Propagate error to caller
  }
};
