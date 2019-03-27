const azure = require('azure-storage')
const blobService = azure.createBlobService()

blobService.createContainerIfNotExists(process.env.AZURE_STORAGE_CONTAINER, {
    publicAccessLevel: 'blob'
  }, function(error, result, response) {
    console.log('Iniating Azure Storage Service...')
    if (!error) {
      // if result = true, container was created.
      // if result = false, container already existed.
      
      console.log('Azure storage container <' + process.env.AZURE_STORAGE_CONTAINER +'> created:')
      console.log('Azure storage works as expected.')
      console.log('-----------------------------')
    } else {
        console.log(error)
        process.exit()
    }
  })

  module.exports = {
    createBlockBlobFromText : (name, content, callback) => {
      return blobService.createBlockBlobFromText(process.env.AZURE_STORAGE_CONTAINER,name, content,callback) 
    },
    getBlobToStream: (name, stream, callback) => {
      return blobService.getBlobToStream(process.env.AZURE_STORAGE_CONTAINER, name, stream, callback)
    },
    createBlob: (name, content, callback) => {
      return blobService.getBlobToStream(process.env.AZURE_STORAGE_CONTAINER, name, stream, callback)
    },
    deleteBlob: (filename, callback) => {
      return blobService.deleteBlob(process.env.AZURE_STORAGE_CONTAINER, filename, (err) => {
        if (err) {
          return callback(err);
        }
        callback()
      })
    }

  }

