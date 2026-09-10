const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: (process.env.MAIL_USER || "").trim(),
        pass: (process.env.MAIL_PASS || "").replace(/\s+/g, "").trim(),
    },
});

module.exports = transporter;
