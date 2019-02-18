const db = require('../database')
const errors = require('../errors')

/**
 * List access log
 */

exports.listAccessLog = (req, res) => {

    const query = `SELECT id, client, file, first_name, last_name, time_stamp, ip FROM AccessLog ORDER BY time_stamp DESC limit 500`

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
exports.create = (req, res) => {
    const client = req.body.client
    const file = req.body.file
    const first_name = req.user.given_name
    const last_name = req.user.family_name
    const ip = req.user.ipaddr
    
    const query = `INSERT INTO AccessLog(client, file, first_name, last_name, ip) VALUES($1, $2, $3, $4, $5)`

    db.query(query,[client, file, first_name, last_name, ip],(err,queryRes) => {
        if(err){
            res.send({success: false,
                error: errors.DB_ERR})
        }else {
            res.send({success: true})
        }
    })

}