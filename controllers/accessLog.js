const db = require('../database')
const errors = require('../errors')

/**
 * List access log
 */

 //TODO: Move to its own type file
 const CLIENT = 'client'
 const FILE = 'file'
 const CONSULTANT = 'consultant'
 const IP = 'ip'

exports.listAccessLog = (req, res) => {

    const type = req.params.type
    const id = req.params.id 

    let where_constraint = ''
    let parameters = null

    switch(type) {
        case CLIENT:
            where_constraint =  'WHERE client_id=$1'
            parameters = [id] 
        break
        case FILE:
            where_constraint =  'WHERE file_id=$1'
            parameters = [id] 
        break 
        case CONSULTANT:
            where_constraint =  'WHERE consultant_id=$1'
            parameters = [id] 
        case IP:
            where_constraint =  'WHERE ip=$1'  
            parameters = [id] 
        break 
    }

    const query = `
        SELECT
            client_id,
            client_name,
            consultant_id,
            file_id,
            file_name,
            first_name,
            ip,
            last_name,
            timestamp,
            type
        FROM AccessLogView
        ${where_constraint}
        ORDER BY timestamp DESC
        LIMIT 500 
      `

    db.query(query,parameters,(err,queryRes) => {
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
            INSERT INTO AccessLog(file_id, consultant_id, ip, type) 
            VALUES($1, $2, $3, $4)`

    db.query(query,[file_id, req.user.consultant_id, ip, type],(err,queryRes) => {
        if(err){
            console.log(err)
        }
    })

}