const db = require('../database')
const errors = require('../errors')

/**
 * List favourites
 */

exports.listFavourites = (req, res) => {

    const query = "SELECT name, client_id FROM Favourites as F INNER JOIN Client as C ON F.client_id = C.id INNER JOIN Consultant AS U ON F.user_id = U.id WHERE F.user_id = '" + req.user.consultant_id + "'"

    db.query(query,null,(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({favourites: queryRes.rows})
        }
    })
}   

/**
 * Create favourite
 */
exports.create = (req, res) => {
   

    const user_id = req.user.consultant_id
    const client_id = req.body.client_id
    
    const query = `
            INSERT INTO Favourites(user_id, client_id) 
            VALUES($1, $2)`

    db.query(query,[user_id, client_id],(err,queryRes) => {
        if(err){
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({favourites: queryRes.rows})
        }
    })

}
