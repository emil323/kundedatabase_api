

const db = require('../database')
const errors = require('../errors')


/**
 * Sends client name, rootfolder and it's client ID
 */

exports.get = (req,res) => {

    const clientID = req.params.client_id

    const query = `
        SELECT C.name, F.id AS root_folder, c.id as client_id
        FROM Folder AS F, Client AS C
        WHERE C.id = F.client_id
        AND C.id = $1
        AND parent_id IS NULL;
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
        SELECT id,client_id,parent_id,name,ref,last_changed,
            CASE
                WHEN client_id IS NULL THEN FALSE
                ELSE TRUE
            END AS is_directory,
            CASE
                WHEN parent_id IS NULL THEN TRUE
                ELSE FALSE
            END AS is_root
            FROM
            (SELECT id, client_id, parent_id, name, null AS ref, last_changed
            FROM Folder
                UNION
            SELECT File.id, Folder.client_id, File.folder_id, File.name, File.ref, File.last_changed
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
            res.send(queryRes.rows[0])
        }
    })

}
