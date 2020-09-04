const jsonServer = require('json-server');
const { BlobServiceClient } = require('@azure/storage-blob');

const DELAYINMS = process.env.DELAYINMS || 5; // very short by default

const server = jsonServer.create();
// const router = jsonServer.router(
//   "https://psgraphqlstorage.blob.core.windows.net/testcontainer/db.json"
// );
const router = jsonServer.router("db.json");
server.use(function(req, res, next) {
  setTimeout(next, DELAYINMS);
});

const middlewares = jsonServer.defaults();
//https://docs.microsoft.com/en-us/azure/storage/blobs/storage-quickstart-blobs-nodejs#upload-blobs-to-a-container


server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
}); 
