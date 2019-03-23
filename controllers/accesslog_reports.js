const db = require('../database')
const errors = require('../errors')

exports.consultant = (req, res) => {

    const consultant_id = req.params.consultant_id

    const query = `
        SELECT client_name, client_id, MIN(timestamp) AS first_visit, MAX(timestamp) AS last_visit
        FROM AccessLogView
        WHERE consultant_id = $1
        GROUP BY client_name, client_id
      `

    db.query(query,[consultant_id],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            res.send(queryRes.rows)
        }
    })
}  