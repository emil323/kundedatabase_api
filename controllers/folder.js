const db = require('../database')
const errors = require('../errors')

const Promise = require('bluebird')

/**
 * Get a file
 */



exports.rename = (req, res) => {

    const query = `
        UPDATE Folder
        SET name = $1
        WHERE id = $2
    `
    const {folder_id} = req.params
    const {new_name} = req.body
    
    db.query(query,[new_name,folder_id],(err) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({success: true})
        }
    })
    
 }


exports.move = (req, res) => {

    const query = `
        UPDATE Folder
        SET parent_id = $1
        WHERE id = $2
    `
    const {folder_id} = req.params
    const {new_parent_folder} = req.body
    
    db.query(query,[new_parent_folder,folder_id],(err) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({success: true})
        }
    })
    
 }


 exports.delete = (req, res) => {
    
    const query = `
        SELECT delete_folder($1)
    `

    const {folder_id} = req.params
    

    db.query(query,[folder_id],(err) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({success: true})
        }
    })
 }

 exports.recover = (req, res) => {
    
    const query = `
        SELECT recover_folder($1,$2)
    `

    const {folder_id} = req.params
    const {new_parent_folder} = req.body
    
    db.query(query,[folder_id, new_parent_folder],(err) => {
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
 * Creates a folder within a folder
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
        INSERT INTO File(folder_id, name, ref, type, size) 
        VALUES($1,$2,$3,$4,$5)
        `

    const folder_id =  req.params.folder_id

    //Make a promise map
    Promise.map(req.files, file => {
        return new Promise((resolve) => {

            const {originalname, mimetype, blobName, blobSize} = file 
            const insert = [folder_id, originalname, blobName, mimetype, blobSize]

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