

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
        WHERE id = $1
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

exports.files = (req, res) => {

    const clientID = req.params.client_id

    const query = `
        SELECT id,client_id,parent_id,name,ref, type,last_changed, is_directory,
            CASE
            WHEN parent_id IS NULL THEN TRUE
            ELSE FALSE
            END AS is_root
        FROM
            (SELECT id, client_id, parent_id, name, null AS ref, 'folder' AS type, last_changed, true AS is_directory
            FROM Folder
            UNION
            SELECT File.id, Folder.client_id, File.folder_id, File.name, File.ref, File.type, File.last_changed, false AS is_directory
            FROM File, Folder
            WHERE Folder.id = File.folder_id) AS U
        WHERE client_id = $1
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
