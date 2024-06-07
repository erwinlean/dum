"use strict";

const emailSender = require("../utils/mailer");

async function testMailer() {
  try {
    const email = await emailSender("emarte@criteria.online", "erwin", "test email");

    console.log("Email:", email);
  } catch (error) {
    console.error("Error email:", error.message);
  };
};

testMailer("Email Tester", "mensaje");