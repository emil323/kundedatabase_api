
const db = require('../database')
const errors = require('../errors')

/**
 * List all clients 
 */

exports.list = (req,res) => {

    const query = `SELECT id, name FROM Client`

    db.query(query,null,(err,queryRes) => {
        res.send({clients: queryRes.rows})
    })
}

/**
 * List access log
 */

exports.listAccessLog = (req, res) => {
    const query = `SELECT id, email, first_name, last_name, last_changed FROM AccessLog`

    db.query(query,null,(err,queryRes) => {
        res.send({accesslog: queryRes.rows})
    })
}

/**
 * Create client
 */
exports.create = (req,res) => {

    const name = req.body.name

    const query = `INSERT INTO Client(name) VALUES($1)`

    db.query(query,[name],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({success: true})
        }
    })
}
