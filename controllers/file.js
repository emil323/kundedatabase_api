const db = require('../database')
const errors = require('../errors')
const accessLog = require('./accessLog')

const blobService = require('../storage/azure-storage')

exports.metadata = (req, res) => {

    const query = `
    SELECT  F.name AS file_name, F.id AS file_id,
            P.name AS folder_name, P.id AS folder_id,
            C.name AS client_name, C.id AS client_id,
            F.type AS file_type,
        CASE
            WHEN P.parent_id IS NULL THEN TRUE
            ELSE FALSE
        END AS parent_is_root
        FROM FilesAndFolders AS F, Client AS C, Folder AS P
        WHERE C.id = F.client_id
            AND F.parent_id = P.id
            AND is_directory IS FALSE AND C.is_deleted IS FALSE
            AND F.id = $1
    `
    const file_id =  req.params.file_id

    db.query(query,[file_id],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send(queryRes.rows[0])
        }
    })
}

exports.download = (req, res) => {

    const query = `
        SELECT ref, type FROM File 
        WHERE IS_DELETED IS FALSE 
        AND id = $1
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

                var options =  {contentSettings:{contentType:type}}
                blobService.getBlobToStream(ref, res, options,(error, result, response) => {
                    if (error)  {
                        console.log(error)
                    } else {
                        accessLog.create(req, file_id, 'VIEW_FILE')
                    }
                })
            } else {
                res.sendStatus(404)
            }
        }
    })
}

exports.rename = (req, res) => {

    const query = `
        UPDATE File
        SET name = $1
        WHERE id = $2
    `
    const {file_id} = req.params
    const {new_name} = req.body
    
    db.query(query,[new_name,file_id],(err) => {
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
        UPDATE File
        SET folder_id = $1
        WHERE id = $2
    `
    const {file_id} = req.params
    const {new_parent_folder} = req.body
    
    db.query(query,[new_parent_folder, file_id],(err) => {
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
        SELECT delete_file($1)
    `

    const {file_id} = req.params

    db.query(query,[file_id],(err) => {
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
        SELECT recover_file($1,$2)
    `

    const {file_id} = req.params
    const {new_parent_folder} = req.body

    db.query(query,[file_id, new_parent_folder],(err) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({success: true})
        }
    })
 }