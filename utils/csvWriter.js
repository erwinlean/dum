"use strict";

const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const csvWriter = async (filesData) => {
  const csvWriter = createCsvWriter({
    path: "filesData.csv",
    header: [
      { id: "title", title: "Title" },
      { id: "createdDate", title: "Creation Date" },
      { id: "modifiedDate", title: "Last Modified Date" },
      { id: "owner", title: "Owner" },
      { id: "url", title: "URL" },
    ],
  });

  filesData.forEach(file => {
    file.createdDate = formatDate(file.createdDate);
    file.modifiedDate = formatDate(file.modifiedDate);
  });

  await csvWriter.writeRecords(filesData);
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
  return date.toLocaleDateString('es-ES', options);
};

module.exports = csvWriter;