const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require('cors');
const bearerToken = require('express-bearer-token')
const clients_route = require('./routes/clients');
const requireAuth = require('./auth/azure-ad.auth') 
/**
 * Bruk dotenv modulen til å laste inn env variabler fra .env fila, dersom vi er i development modus
 */

if(process.env.NODE_ENV !== 'production') {
   dotenv.config()
 }
 /*
   Allow Cross Origin Access 
 */

app.use(cors())

/*
 Extracts JWT token from header
*/

app.use(bearerToken())

/*
  Middleware for azure authentication. All api access requires valid token.
*/
app.use(requireAuth())

 /**
  * Definer API ruter
  */

 app.use('/clients', clients_route)

 /**
 * Start server
 */

const port = process.env.PORT || 8080;

const server = app.listen(port, function () {
   var port = server.address().port 
   console.log("-----------------------------")
   console.log("Node.JS Backend API Started: http://localhost:%s", port)
   console.log("-----------------------------")
})