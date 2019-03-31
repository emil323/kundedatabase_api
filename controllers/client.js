

const db = require('../database')
const errors = require('../errors')




/**
 * Sends client name, rootfolder and it's client ID
 */

exports.get = (req,res) => {


    const clientID = req.params.client_id

    const query = `
        SELECT name
        FROM Client
        WHERE is_deleted IS FALSE
        AND id = $1
    `

    db.query(query,[clientID],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
                //TODO: Mor error handling
        } else {
            res.send(queryRes.rows[0])
        }
    })

}





/**
 * List files
 */

exports.files = (req, res) => {

    const clientID = req.params.client_id

    const query = `
        SELECT id,client_id,parent_id,name,ref, type,last_changed, size, is_deleted,is_directory, is_root
        FROM FilesAndFolders
        WHERE permanently_deleted IS FALSE
        AND client_id = $1
    `

    db.query(query,[clientID],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
                //TODO: Mor error handling
        } else {
            res.send(queryRes.rows)
        }
    })

}

/**
 * Feeding recycle bin, only show deleted files that has not yet been permanently deleted.
 */

exports.deleted_files = (req, res) => {

    const clientID = req.params.client_id

    const query = `
        SELECT id,client_id,parent_id,name,ref, type,last_changed, is_deleted,is_directory, is_root
        FROM FilesAndFolders
        WHERE is_deleted IS TRUE 
            AND permanently_deleted IS FALSE
        AND client_id = $1
    `

    db.query(query,[clientID],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
                //TODO: Mor error handling
        } else {
            res.send(queryRes.rows)
        }
    })

}