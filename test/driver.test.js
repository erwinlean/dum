"use strict";

const listFiles = require("../services/googleDrive");

async function testGoogleDrive() {
  try {
    const files = await listFiles();

    console.log("Files retrieved from Google Drive:", files)
  } catch (error) {
    console.error("Error retrieving files:", error.message);
  };
};

testGoogleDrive();