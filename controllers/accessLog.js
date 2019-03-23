const db = require('../database')
const errors = require('../errors')
const ObjectsToCsv = require('objects-to-csv')

/**
 * List access log
 */

 //TODO: Move to its own type file
 const CLIENT = 'client'
 const FILE = 'file'
 const CONSULTANT = 'consultant'
 const IP = 'ip'

exports.listAccessLog = (req, res) => {

    async function sendCSV(res,data) {
        res.send(
            await new ObjectsToCsv(data).toString()
        )
    }

    const type = req.params.type
    const id = req.params.id 
    const csv_export = req.query.csv_export

    let where_constraint = ''
    let parameters = null

    switch(type) {
        case CLIENT:
            where_constraint =  'WHERE client_id=$1'
            parameters = [id] 
        break
        case FILE:
            where_constraint =  'WHERE file_id=$1'
            parameters = [id] 
        break 
        case CONSULTANT:
            where_constraint =  'WHERE consultant_id=$1'
            parameters = [id] 
        break    
        case IP:
            where_constraint =  'WHERE ip=$1'  
            parameters = [id] 
        break 
    }

    const query = `
        SELECT
            client_id,
            client_name,
            file_id,
            parent_id,
            consultant_id,
            file_name,
            first_name,
            last_name,
            ip,
            timestamp,
            type
        FROM AccessLogView
        ${where_constraint}
        ORDER BY timestamp DESC
        ${csv_export ? '' : 'LIMIT 500'}
      `

    db.query(query,parameters,(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
        } else {
            csv_export ? sendCSV(res, queryRes.rows) : res.send({accesslog: queryRes.rows})
        }
    })
}   

/**
 * Create logItem
 */
exports.create = (req, file_id, type) => {

    const ip = req.user.ipaddr
    console.log('create')
    const query = `
            INSERT INTO AccessLog(file_id, consultant_id, ip, type) 
            VALUES($1, $2, $3, $4)`
    
    db.query(query,[file_id, req.user.consultant_id, ip, type],(err,queryRes) => {
        if(err){
            console.log('accesslog', err)
        }
    })

}