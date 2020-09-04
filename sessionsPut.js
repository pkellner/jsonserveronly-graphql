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

        // data.speakers.forEach(function (rec) {
        //   if (rec.id == speakerId) {
        //     rec = req.body;
        //   }
        // });

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

        // Create a unique name for the container
        const containerName = 'jsonserver';

        console.log('\nCreating container...');
        console.log('\t', containerName);

        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(
          containerName,
        );

        // Create the container
        const createContainerResponse = containerClient.create();
        console.log(
          'Container was created successfully. requestId: ',
          createContainerResponse.requestId,
        );

        // Create a unique name for the blob
        const blobName = 'db.json';

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        console.log('\nUploading to Azure storage as blob:\n\t', blobName);

        // Upload data to the blob
        const data1 = JSON.stringify(data, null, 5);
        const blobOptions = {
          blobHTTPHeaders: { blobContentType: 'application/json' },
        };
        const uploadBlobResponse = blockBlobClient.upload(
          data1,
          data1.length,
          blobOptions,
        );
        console.log(
          'Blob was uploaded successfully. requestId: ',
          uploadBlobResponse.requestId,
        );

        //
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    next();
  }
};
