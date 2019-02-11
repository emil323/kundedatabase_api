
/**
 * Bruk dotenv modulen til å laste inn env variabler fra .env fila, dersom vi er i development modus
 */

if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config({path: __dirname + '/.env'})

  if(!process.env.PORT) {
    console.error("Du mangler .env fila i kundedatabase_api!")
    process.exit()
  }
}

const express = require('express');
const app = express();

const cors = require('cors');
const bearerToken = require('express-bearer-token')
const bodyParser = require('body-parser')

const client_route = require('./routes/client');
const clients_route = require('./routes/clients');
const files_route = require('./routes/files');
const users_route = require('./routes/users');
const accessLog_route = require('./routes/accessLog');

const requireAuth = require('./auth/azure-ad.auth') 


/**
 * Handle post request formatting
 */

app.use(express.json())
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
  Comment out to disable authentication, useful when creating new functionality in API
*/
app.use(requireAuth())

 /**
  * Definer API ruter
  */
app.use('/accesslog', accessLog_route);
app.use('/clients', clients_route)
app.use('/client', client_route)
app.use('/users', users_route)
app.use('/files', files_route)
app.use('/useraccess', users_route);
 

 /**
 * Start server
 */

const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log("-----------------------------")
    console.log("Node.JS Backend API Started: http://localhost:%s", port)
    console.log("-----------------------------")
 })
