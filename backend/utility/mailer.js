const nodemailer = require('nodemailer');

// Create the transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false // Don't use this in production
  }
});

// HTML Template Generator
function generateHtmlTemplate(name, type) {
  const content =
    type === 'welcome'
      ? `<p>We're excited to have you at <strong>AI-Powered Startup Success Platform</strong>.</p>
         <p>This platform will guide you with AI coaching, predictive analytics, and real-time collaboration to build, pitch, and grow your startup.</p>
         <a href="https://your-platform.com/login" class="button">Go to Dashboard</a>`
      : `<p>You have just signed in to your account. If this wasn't you, please secure your account immediately.</p>
         <a href="https://your-platform.com/security" class="button">Secure Account</a>`;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #2c3e50;
        }
        p {
          color: #555;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          padding: 12px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
        }
        .footer {
          text-align: center;
          color: #aaa;
          font-size: 12px;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${type === 'welcome' ? `Welcome, ${name}! 👋` : `Login Alert, ${name}`}</h1>
        ${content}
        <div class="footer">
          © 2025 AI Startup Success Platform — All Rights Reserved
        </div>
      </div>
    </body>
  </html>
  `;
}

// Send Welcome Email
async function sendWelcomeEmail(to, name) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Welcome to AI-Powered Startup Success Platform!',
    html: generateHtmlTemplate(name, 'welcome')
  });
}

// Send Login Notification Email
async function sendLoginNotification(to, name) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Login Notification',
    html: generateHtmlTemplate(name, 'login')
  });
}

module.exports = {
  sendWelcomeEmail,
  sendLoginNotification
};
