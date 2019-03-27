
const db = require('../database')
const errors = require('../errors')

/**
 * List all users 
 */

exports.list = (req,res) => {

    const query = `
    SELECT id, email, first_name, last_name, is_admin, blocked
    FROM Consultant`

    db.query(query,null,(err,queryRes) => {
        if(err) {
            console.log('controllers/users - list()',err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send(queryRes.rows)
        }
    })
}


/**
 * Finds or creates user, callback err and user_id 
 */

exports.find_or_create = (user, callback) => {
    const query = `SELECT create_or_find_user($1,$2,$3,$4)`

    const first_name = user.given_name ? user.given_name : user.name
    const last_name = user.family_name ? user.family_name : '' 

    db.query(query,[user.unique_name, first_name, last_name, user.is_admin],(err,queryRes) => {
        if(err) {
            console.log('controllers/users - find_or_create()',err)
            callback(errors.DB_ERR)
        } else {
            //Successful, callback result ()
            const consultant_id = queryRes.rows[0].create_or_find_user
            callback(null, consultant_id)
        }
        
    })
}

/**
 * Create client
 */
exports.create = (req,res) => {

    const email = req.body.email
    const first_name = req.body.first_name
    const last_name = req.body.last_name

    const query = `INSERT INTO Consultant(email, first_name, last_name) VALUES($1, $2, $3)`

    db.query(query,[email, first_name, last_name],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send({success: true})
        }
    })
}


/* const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

exports.list = (req, res) => {
    
    const client = MicrosoftGraph.Client.init({
        authProvider: (done) => {
            done(null, req.params.token) //first parameter takes an error if you can't get an access token
        }
    })

    client
    .api('/users')
    .get((err, result) => {

        if(err) {
            console.log(err)
            res.send(err)
        } else {
            console.log(result); // prints info about authenticated user

            res.send(result)
        }
    })
}
 */