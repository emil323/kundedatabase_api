
const aad = require('azure-ad-jwt')
const users = require('../controllers/users')


/**
 * This is a middleware that handles authorization of consultant
 */

module.exports = function() {
    return function(req, res, next) {
        if(req.token) {
            aad.verify(req.token, null, function(err, result) {
                if(result) {
                    //Set req.user object
                    req.user = result 
                    console.log("Incoming request:" + req.originalUrl)

                    //Run find_or_create_user to fetch consultant_id 
                    users.find_or_create(req.user, (err,consultant_id) => {
                        if(err) {
                            res.sendStatus(500)
                        } else {
                            //Set consultant ID 
                            req.user.consultant_id = consultant_id
                            return next()
                        }
                    })
                } else {
                    console.log(err)
                }
            })
        } else {
            //No auth
            res.sendStatus(401);
        }
    }
}