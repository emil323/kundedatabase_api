
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
 * Create client
 */
exports.create = (req,res) => {
    
    const name = req.body.client


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
