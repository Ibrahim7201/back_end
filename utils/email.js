const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config({ path: '../config.env' });

const sendEmail = async options => {
  //1-create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'alivia.bayer84@ethereal.email',
      pass: 'T78QEDM5m5beHQ9J8v',
    },
  });
  //2-Define email OPTIONS
  const mailOptions = {
    from: 'Ibrahim Abdelazim <ibrahimabdelazim@yahoo.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3-Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
