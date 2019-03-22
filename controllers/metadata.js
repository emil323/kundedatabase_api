
const db = require('../database')
const errors = require('../errors')

const validate = require("validate.js");
const accessLog = require('./accessLog')
const blobService = require('../storage/azure-storage')
const Promise = require('bluebird')

exports.default_values = (req,res) => {

    const query = `
        SELECT value 
        FROM ClientMetadataDefaultField
        ORDER BY value_order
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

exports.update_default_values = (req,res) => {

    const {default_values} = req.body

    const insert_query = `
        INSERT INTO ClientMetadataDefaultField
        VALUES($1,$2)
    `
    const delete_query = `
        DELETE FROM ClientMetadataDefaultField
    `

    //Set a maxium om 15 default values, and minimum 1
    if(default_values.length < 15 && default_values.length > 0) { 
        /**
         * Fetch client, to be used for transaction
         */

        db.getClient((err, client, done) => {
            if(err) handleErr(err, res) 
            else {
                //Start transaction
                client.query('BEGIN', (err) => {
                    if(err) handleErr(err,res)
                    else {
                        //Delete all old default fields
                        client.query(delete_query, (err) => {
                            if(err) handleErr(err,res)
                            //Insert new default fields
                            else {
                                //Use Promise map
                                Promise.map(default_values, (value, i) => {
                                    return new Promise((resolve, reject) => {
                                        //Query insert
                                        client.query(insert_query,[value.title,i],(err) => {
                                            if(err) {
                                            reject(err)
                                            } else {
                                                resolve(true)
                                            }
                                        })
                                    })
                                }, {concurrency:5}) //Maximum 5 queries at a time
                                .then(result => {
                                    console.log(result)
                                    //Commit
                                    client.query('COMMIT')
                                    res.send({success:true})
                                }) 
                            }
                        })
                    }
                })
            }
        })
    } else {
        //Send error
        res.send({success:false,
            error:errors.INVALID_INPUT})
    }

    const handleErr = (err, res) => {
        console.log(err)
            res.send({success: false, 
                error: errors.DB_ERR})
    }

}


/**
 * Retrives client metadata if available
 */

exports.get = (req,res) => {


    const clientID = req.params.client_id

    /**
     * Get reference for metadata file, and root folder.
     * We need root folder, because accesslog requires a file_id to reference to. 
     */

    const query = `
        SELECT M.ref, F.id AS root_id
        FROM ClientMetadata AS M, FilesAndFolders AS F
        WHERE M.client_id = F.client_id
        AND M.client_id = $1
        AND F.is_root IS TRUE AND F.is_deleted IS FALSE
        ORDER BY timestamp DESC
        LIMIT 1;
    `
    db.query(query,[clientID],(err,queryRes) => {
        if(err) {
            res.send({success: false, 
                error: errors.DB_ERR})
                //TODO: Mor error handling
        } else {
            //Check if metadata row was found
            if(queryRes.rows.length > 0) {
                const {ref, root_id} = queryRes.rows[0]

                //Attempt to fetch JSON file that contains metadata
                blobService.getBlobToStream(ref, res,(error, result, response) => {
                    if (error)  {
                        console.log(error)
                    } else {
                        //TODO: Add accesslog entry here
                        accessLog.create(req, root_id, 'CLIENT_METADATA')
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
    console.log(req.body)
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