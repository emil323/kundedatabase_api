
const aad = require('azure-ad-jwt')
const users = require('../controllers/users')


/**
 * This is a middleware that handles authorization of consultant
 */

module.exports = function() {
    return function(req, res, next) {
        if(req.token) {
            //Verify JWT token (from microsoft)
            aad.verify(req.token, null, function(err, result) {
                //Check if JWT token is meant for this application
                if(result && result.aud === process.env.APP_ID) {
                    //Set req.user object
                    req.user = result 
                    //Set is_admin boolean to true if admin
                    req.user.is_admin = result.roles ? result.roles.includes(process.env.AD_ADMIN_ROLE) : false
                    //Log request
                    console.log("Incoming request:" + req.originalUrl + ' - is_admin: ' + req.user.is_admin)
                    //Run find_or_create_user to fetch consultant_id 
                    users.find_or_create(req.user, (err,consultant_id) => {
                        if(err) {
                            console.log(err)
                            //This didt work, we set 500 (server error)
                            res.sendStatus(500)
                        } else {
                            //Set consultant ID 
                            req.user.consultant_id = consultant_id
                            return next()
                        }
                    })
                } else {
                    console.log(err)
                    //Check if JWT token is expired
                    res.sendStatus(499)
                }
            })
        } else {
            //No auth
            res.sendStatus(401);
        }
    }
}