const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true, // Recommended for port 465
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `DhagaKart <${process.env.SMTP_MAIL}>`, // Provides a sender name
        to: options.email,
        subject: options.subject,
        html: options.html, // CORRECTED: Changed from options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;