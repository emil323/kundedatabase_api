const db = require('../database')
const errors = require('../errors')

/**
 * List access log
 */

exports.listAccessLog = (req, res) => {

    const client_id = req.params.client_id 

    //Construct where if client id is supplied
    const where_constraint = client_id === undefined ? '' : 'WHERE client_id=$1'
    const parameters = client_id === undefined ? null : [client_id]
    
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