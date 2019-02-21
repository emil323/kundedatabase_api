const db = require('../database')
const errors = require('../errors')

/**
 * List access log
 */

exports.listAccessLog = (req, res) => {

    const query = `
    SELECT F.name AS file_name, F.id AS file_id, C.name AS client_name, C.id AS client_id, ip, AL.type, timestap AS timestamp
    FROM AccessLog AS AL, File AS F, Folder AS FO, Client AS C
    WHERE AL.file_id = F.id
      AND F.folder_id = FO.id
      AND FO.client_id = C.id`

    db.query(query,null,(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({accesslog: queryRes.rows})
        }
    })
}   

/**
 * Create logItem
 */
exports.create = (req, file_id, type) => {

    const ip = req.user.ipaddr
    
    const query = `
            INSERT INTO AccessLog(file_id, ip, type) 
            VALUES($1, $2, $3)`

    db.query(query,[file_id, ip, type],(err,queryRes) => {
        if(err){
            console.log(err)
        }
    })

}