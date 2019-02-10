const db = require('../database')
const errors = require('../errors')

/**
 * List access log
 */

exports.listAccessLog = (req, res) => {
    const query = `SELECT id, first_name FROM AccessLog`

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
