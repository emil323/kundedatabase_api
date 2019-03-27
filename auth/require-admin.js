
/**
 * This is a middleware that stops a request if user is not admin
 */

module.exports = function() {
    return function(req, res, next) {
        //Check if user is admin, if not return wih a 401 error
        if(req.user && req.user.is_admin) {
            return next()
        } else {
            //Not admin
            res.sendStatus(403)
            res.end()
        }
    }
}