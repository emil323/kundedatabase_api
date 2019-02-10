const db = require('../database')
const errors = require('../errors')
const blobService = require('../storage/azure-storage')
const Promise = require('bluebird')

/**
 * Get a file
 */

exports.get_file = (req, res) => {

    const query = `
        SELECT ref, type FROM File WHERE id = $1
    `
    const file_id =  req.params.file_id

    db.query(query,[file_id],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            if(queryRes.rows.length !== 0) { 

                const {ref, type} = queryRes.rows[0]

                blobService.getBlobToStream(ref, res, (error, result, response) => {
                    if (error) console.log(error)
                })
            } else {
                res.sendStatus(404)
            }
        }
    })
}


/**
 * Creates a folder within a directory
 */

 exports.create_folder = (req, res) => {

    const query = `
        SELECT create_folder($1,$2)
    `
    const {folder_id} = req.params
    const {new_folder_name} = req.body

    
    db.query(query,[folder_id, new_folder_name],(err) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({success: true})
        }
    })
    
 }


/**
 * Upload a file to a folder
 */

exports.upload = (req,res) => {

    const query = `
        INSERT INTO File(folder_id, name, ref, type) 
        VALUES($1,$2,$3,$4)
        `

    const folder_id =  req.params.folder_id

    //Make a promise map
    Promise.map(req.files, file => {
        return new Promise((resolve) => {

            const {originalname, mimetype, blobName} = file 
            const insert = [folder_id, originalname, blobName, mimetype]

            db.query(query,insert,(err) => {
                if(err) {
                    console.log(err)
                    resolve({originalname,success: false, 
                        error: errors.DB_ERR})
                } else {
                    resolve({originalname,success: true})
                }
            })
        })
    }, {concurrency:1})
    .then(result => {
        res.send(result)
    }) 
}