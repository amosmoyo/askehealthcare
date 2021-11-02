/* eslint-disable no-undef */
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // create a tranporter function (use nodemailer docs)
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD // generated ethereal password
    }
  });

  // send mail with defined transport object
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.text // plain text body
    // html: "<b>Hello world?</b>", // html body
  };
  // send email
  // eslint-disable-next-line no-unused-vars
  const info = await transporter.sendMail(message);
};

module.exports = sendEmail;
