const { sendWelcomeEmail } = require('./mailer');

sendWelcomeEmail('nutalapatisrikrishna85@gmail.com', 'TestUser')
  .then(() => console.log('Mail sent!'))
  .catch(err => console.error('Mail error:', err));