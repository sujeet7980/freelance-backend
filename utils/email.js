const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  //create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // defining the email options
  const mailOptions = {
    from: 'Sujeet Kumar <sujeetk1282@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };
  //actually send the email
  transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
