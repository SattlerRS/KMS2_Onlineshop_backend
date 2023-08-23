const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.gmx.net',
  port: 587,
  secure: false,
  auth: {
    user: '',
    pass: ''
  }
});

module.exports = transporter;
