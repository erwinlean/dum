"use strict";

const { google } = require("googleapis");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const drive = google.drive("v3");
const auth = new google.auth.GoogleAuth({
  credentials: {
    "type": "service_account",
    "project_id": "examen-candidatos-evenbytes",
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key ? process.env.private_key.split(String.raw`\n`).join("\n") : null,
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": process.env.auth_uri,
    "token_uri": process.env.token_uri,
    "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
    "client_x509_cert_url": process.env.client_x509_cert_url
  },
  scopes: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
});

const listFilesInFolder = async (folderId, pageToken = null) => {
  const res = await drive.files.list({
    q: `"${folderId}" in parents`,
    fields: "nextPageToken, files(id, name, mimeType, createdTime, modifiedTime, owners, webViewLink)",
    pageToken: pageToken,
  });

  return res.data;
};

const getAllPDFFilesRecursive = async (folderId, pageToken = null, accumulatedFiles = []) => {
  const { files, nextPageToken } = await listFilesInFolder(folderId, pageToken);

  for (const file of files) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      const subfolderFiles = await getAllPDFFilesRecursive(file.id);
      accumulatedFiles = accumulatedFiles.concat(subfolderFiles);
    } else if (file.mimeType === "application/pdf") {
      accumulatedFiles.push({
        title: file.name,
        createdDate: file.createdTime,
        modifiedDate: file.modifiedTime,
        owner: file.owners[0].emailAddress,
        url: file.webViewLink,
      });
    }
  }

  if (nextPageToken) {
    return await getAllPDFFilesRecursive(folderId, nextPageToken, accumulatedFiles);
  } else {
    return accumulatedFiles;
  };
};

const listFiles = async () => {
  if (!process.env.private_key) {
    throw new Error("Private key is not defined in .env");
  }

  const authClient = await auth.getClient();
  google.options({ auth: authClient });

  const pdfFiles = await getAllPDFFilesRecursive(process.env.folder_id);

  return pdfFiles;
};

module.exports = listFiles;