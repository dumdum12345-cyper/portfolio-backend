const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactNotification = async ({ name, email, message }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `New Portfolio Message from ${name}`,
    html: `<h3>From: ${name}</h3><p>Email: ${email}</p><p>${message}</p>`,
  });
};

const sendAutoReply = async ({ name, email }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Thanks for reaching out, ${name}!`,
    html: `<p>Hi ${name}, thanks for your message! I'll get back to you within 24 hours.</p><p>— Chidubem Francis</p>`,
  });
};

module.exports = { sendContactNotification, sendAutoReply };
