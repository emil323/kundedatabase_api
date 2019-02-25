
const db = require('../database')
const errors = require('../errors')

/**
 * List all clients 
 */

exports.list = (req,res) => {

    const consultant_id = req.user.consultant_id

    const query = `
            SELECT  id,
                    name,
                    CASE WHEN
                    F.client_id IS NULL THEN
                    FALSE ELSE TRUE
                    END AS is_favourite
            FROM Client AS C
            LEFT JOIN Favourites F on C.id = F.client_id
                AND F.user_id = $1
            WHERE is_deleted IS FALSE
            ORDER BY name
    ` // Columns returned: id, name, is_favourite

    db.query(query,[consultant_id],(err,queryRes) => {
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
