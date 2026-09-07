const nodemailer = require("nodemailer");

// Create reusable transporter object using Gmail SMTP service
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: (process.env.MAIL_USER || "").trim(),
        pass: (process.env.MAIL_PASS || "").replace(/\s+/g, "").trim(),
    },
});

module.exports = transporter;
