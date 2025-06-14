const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Only for testing (remove in production)
  }
});

async function sendWelcomeEmail(to, name) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to AI-Powered Startup Success Platform!',
    text: `Hello ${name},\n\nThank you for registering. We're excited to have you on board!`
  });
}

async function sendLoginNotification(to, name) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Login Notification',
    text: `Hello ${name},\n\nYou have just signed in to your account. If this wasn't you, please secure your account.`
  });
}

module.exports = { sendWelcomeEmail, sendLoginNotification };