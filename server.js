const jsonServer = require('json-server');
const { BlobServiceClient } = require('@azure/storage-blob');

const server = jsonServer.create();
// const router = jsonServer.router(
//   "https://psgraphqlstorage.blob.core.windows.net/testcontainer/db.json"
// );
const router = jsonServer.router();

const middlewares = jsonServer.defaults();
//https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-nodejs#upload-blobs-to-a-container


server.use(middlewares);
server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running on port 5000');
});
