"use strict";

const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const myEmail = process.env.email;
const mailerUrl = process.env.mailer;
const transporter = nodemailer.createTransport(mailerUrl);

const emailSender = async (email, nombre, mensaje) => {
  const mailOptions = {
    from: email,
    to: myEmail,
    subject: "Drive data from PDFs",
    html: emailHtml(nombre, mensaje),
    attachments: [
      {
        filename: 'data.csv',
        path: path.resolve(__dirname, '../data.csv'),
        contentType: 'text/csv'
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    };
  });
};

const emailHtml = (nombre, mensaje) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; color:black;">
        <h1 style="color: #61AE4E;">Mensaje de: ${nombre}</h1>
        <br>
        <p style="font-size: 18px; margin-bottom: 20px;">${mensaje}</p>
        <br> 
    </div>
  `;
};

module.exports = emailSender;