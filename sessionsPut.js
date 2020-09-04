const axios = require('axios');
const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = (req, res, next) => {
  const urlStartSpeakers = '/speakers/';

  if (req.url.startsWith(urlStartSpeakers) && req.method === 'PUT') {
    const blobUrl =
      'https://psgraphqlstorage.blob.core.windows.net/jsonserver/db.json';

    axios
      .get(blobUrl)
      .then(function (response) {
        const speakerId = parseInt(req.url.slice(urlStartSpeakers.length));
        const data = response.data;

        const findIndex = data.speakers.findIndex((rec) => {
          return rec.id == speakerId;
        });

        data.speakers[findIndex] = req.body;

        const str = JSON.stringify(data, null, 2);
        console.log(str);

        const AZURE_STORAGE_CONNECTION_STRING =
          process.env.AZURE_STORAGE_CONNECTION_STRING;

        console.log(
          `AZURE_STORAGE_CONNECTION_STRING ${AZURE_STORAGE_CONNECTION_STRING}`,
        );

        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(
          AZURE_STORAGE_CONNECTION_STRING,
        );

        const containerName = 'jsonserver';
        const containerClient = blobServiceClient.getContainerClient(
          containerName,
        );

        // create or access container
        const createContainerResponse = containerClient.create();
        console.log(
          'Container was created successfully. requestId: ',
          createContainerResponse.requestId,
        );

        const blobName = 'db.json';
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const dataToUpload = JSON.stringify(data, null, 5);
        const blobOptions = {
          blobHTTPHeaders: { blobContentType: 'application/json' },
        };
        const uploadBlobResponse = blockBlobClient.upload(
          dataToUpload,
          dataToUpload.length,
          blobOptions,
        );
        console.log(
          'Blob was uploaded successfully. requestId: ',
          uploadBlobResponse.requestId,
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    next();
  }
};
