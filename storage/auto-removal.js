const db = require('../database')
const blobService = require('../storage/azure-storage')
const Promise = require('bluebird')

exports.run = () => {
    const query = `
        SELECT id, is_directory, ref
        FROM FilesToDelete
    `

    db.query(query,null,(err, res) => {
        if(err) {
            console.log(err)
        } else {
            const length = res.rows.length
            if(length > 0) {
                console.log('-----------------------------')
                console.log('Automatic file removal iniated, there are ' + length  + ' files or folders to remove.')
                console.log('-----------------------------')
                //iniiate deletion
                permanentlyDelete(res.rows)
            }
        }
    })

    /**
     * Function that async deletes files 
     * @param {*} files 
     */

     const permanentlyDelete = (files) => {
         
        Promise.map(files, file => {
            return new Promise((resolve) => {
                resolve(file.is_directory ? removeFolder(file) : removeFile(file)) //Resolve into the remo
            })
        }, {concurrency:1}) //Only one at the time
        .then(result => {
            console.log('-----------------------------')
            console.log('done.')
            console.log('-----------------------------')
        }) 
    }

    /**
     * Logic to remove file
     * @param {*} file 
     */

    const removeFile = (file) => {
        
        const query = `
            UPDATE File
            SET permanently_deleted = TRUE
            WHERE id = $1
        `

        //Remove from Azure storage
        //It's coded in that way it stills removes a file from database even if file is not deleted
        //Its not a good way to do this, but we avoid having a situation where a file will never disappear 
        //beacause it is for some reason deleted in Azure storage... 
        //It's not a huge deal because storage is cheap, and this would be a very rare situation. 
        blobService.deleteBlob(file.ref, (err) => {
            if(err) {
                console.log(err)
            } 

            //Remove from DB
            db.query(query,[file.id],(err) => {
                if(err) {
                    console.log(err)
                    return 'FAILURE: ' + file.name + ', ' + file.id 
                } else {
                    console.log('deleted file: ', file)
                    return true 
                }
            })
        })
    }

    /**
     * Logic to remove folder
     * @param {*} file 
     */

    const removeFolder = (folder) => {
        const query = `
            UPDATE Folder
            SET permanently_deleted = TRUE
            WHERE id = $1
        `
        db.query(query,[folder.id],(err) => {
            if(err) {
                console.log(err)
                return 'FAILURE: ' + folder.name + ', ' + folder.id 
            } else {
                console.log('deleted folder: ', folder)
                return true 
            }
        })
        }
}   