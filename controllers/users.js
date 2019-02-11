
const db = require('../database')
const errors = require('../errors')

/**
 * List all users 
 */

exports.list = (req,res) => {

    const query = `SELECT id, email, first_name, last_name FROM Consultant`

    db.query(query,null,(err,queryRes) => {
        res.send({users: queryRes.rows})
    })
}


/**
 * Create client
 */
exports.create = (req,res) => {

    const name = req.body.name

    const query = `INSERT INTO Consultant(name) VALUES($1)`

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
