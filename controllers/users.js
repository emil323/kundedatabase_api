
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