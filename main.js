"use strict";

const express = require("express");
const cors = require("cors");
const path = require("path");
const listFiles = require("./services/googleDrive");
const csvWriter = require("./utils/csvWriter");
const emailSender = require("./utils/mailer");
require("dotenv").config();

const PORT = process.env.port;

const app = express();

const corsOptions = {
  origin: "*",
  methods: ["GET"],
};
app.use(cors(corsOptions));

app.get("/api/files", async (res) => {
  try {
    const files = await listFiles();
    await csvWriter(files);

    const csvFilePath = path.resolve(__dirname, "./filesData.csv");

    await emailSender("emarte@criteria.online", "PDFs Report", "Csv atacched");

    res.download(csvFilePath, "filesData.csv", (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error sending file: " + err.message);
      };
    });
  } catch (error) {
    res.status(500).send("Error: " + error.message);
  };
});

app.listen(PORT, () => {
  console.log(`Port: ${PORT}`);
});