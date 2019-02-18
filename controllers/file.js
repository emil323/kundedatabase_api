const db = require('../database')
const errors = require('../errors')

const blobService = require('../storage/azure-storage')

exports.download = (req, res) => {

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
     
}