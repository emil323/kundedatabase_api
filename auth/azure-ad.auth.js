
const aad = require('azure-ad-jwt')

module.exports = function() {
    return function(req, res, next) {
        if(req.token) {
            aad.verify(req.token, null, function(err, result) {
                if(result) {
                    //Set req.user object
                    req.user = result 
                    console.log("Incoming request:" + req.originalUrl)
                    return next()
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