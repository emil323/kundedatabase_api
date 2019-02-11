const MicrosoftGraph = require("@microsoft/microsoft-graph-client");

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