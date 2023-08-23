const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'mail.gmx.net',
  port: 587,
  secure: false,
  auth: {
    user: 'testemailclient@gmx.at',
    pass: 'asQW1234'
  }
});

module.exports = transporter;