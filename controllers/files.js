const db = require('../database')
const errors = require('../errors')
const blobService = require('../storage/azure-storage')

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
            const {ref, type} = queryRes.rows[0]
            
            blobService.getBlobToStream(ref, res, (error, result, response) => {
                if (error) console.log(error)
              })
        }
    })
}


/**
 * Upload a file to a folder
 */

exports.upload = (req,res) => {

    const query = `
        INSERT INTO File(folder_id, name, ref, type) 
        VALUES($1, $2,$3,$4)`

    const folder_id =  req.params.folder_id
    const {originalname, mimetype, blobName} = req.file 

    console.log(req.file)

    if(req.file) {
        db.query(query,[folder_id, originalname, blobName, mimetype],(err,queryRes) => {
            if(err) {
                console.log(err)
                res.send({success: false, 
                    error: errors.DB_ERR})
            } else {
                res.send({success: true})
            }
        })
    } else {
        res.send({success: false, 
            error: 'NO_FILE'})
    }
}