
const db = require('../database')
const errors = require('../errors')

const validate = require("validate.js");
const accessLog = require('./accessLog')
const blobService = require('../storage/azure-storage')

exports.default_values = (req,res) => {

    const query = `
        SELECT value 
        FROM ClientMetadataDefaultField
    `
    db.query(query,null,(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
                //TODO: Mor error handling
        } else {
            res.send(queryRes.rows)
        }
    })

}

/**
 * Retrives client metadata if available
 */

exports.get = (req,res) => {


    const clientID = req.params.client_id

    const query = `
        SELECT ref
        FROM ClientMetadata
        WHERE client_id = $1
        ORDER BY timestamp DESC
        LIMIT 1
    `

    db.query(query,[clientID],(err,queryRes) => {
        if(err) {
            console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
                //TODO: Mor error handling
        } else {
            //Check if metadata row was found
            if(queryRes.rows.length > 0) {
                const ref = queryRes.rows[0].ref
                //Attempt to fetch JSON file that contains metadata
                blobService.getBlobToStream(ref, res,(error, result, response) => {
                    if (error)  {
                        console.log(error)
                    } else {
                        //TODO: Add accesslog entry here
                        accessLog.create(req, null, 'CLIENT_METADATA')
                    }
                })
            } else {
                res.send([]) //Send empty array to symoblize nothing is added
            }
        }
    })

}

/**
 * Updates metadata, used in client route
 */

exports.update_metadata = (req,res) => {


    const clientID = req.params.client_id
    const raw_data = req.body.data

    const query = `
        INSERT INTO ClientMetadata(client_id, ref)
        VALUES($1,$2)
        `
    //Define constraints for validation    
    const constraints = {
        title: {
            presence:true
        },
        content: {
            presence:true
        }
    }
    console.log(req.body.data)
    //validate data using validate.js
    const data_valid = validate.isArray(raw_data) 
        ? raw_data.every(value => { //Validate each object in array using every()
            return validate(value, constraints) === undefined})
        : false

    if(data_valid) {
        //Stringify
        const metadata = JSON.stringify(raw_data)    
        //Construct a filename that is random
        const filename =`metadata.${clientID}.${Math.floor(Date.now() /1000)}.json`
        
        //Store metadata as JSON file in Azure storage
        blobService.createBlockBlobFromText(filename, metadata, (err, result, response)=> {
            if(err) {
                //Error received
                console.log(err)
                res.send({success: false, 
                    error: errors.STORAGE_ERR})
            } else {
                //Insert record into database
                db.query(query,[clientID, filename],(err,queryRes) => {
                    if(err) {
                        console.log(err)
                        res.send({success: false, 
                            error: errors.DB_ERR})
                            //TODO: Mor error handling
                    } else {
                        //Everything OK
                        //TODO: accesslog 
                        res.send({success:true})
                    }
                })
            }
        })
    } else {
        //Validation failed
        res.send({success: false, 
            error: errors.INVALID_INPUT})
    }
}