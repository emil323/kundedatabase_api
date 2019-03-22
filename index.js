
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
const requireAuth = require('./auth/azure-ad.auth') 
const autoRemoval = require('./storage/auto-removal')


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

/*
  Forbid request caching
*/

app.use((req, res, next) => {
  res.setHeader('Expires', '-1')
  res.setHeader('Cache-Control', 'no-cache')
  next()
})


 /**
  * Express use routes 
  */

 const routes = {
  client : require('./routes/client'),
  metadata : require('./routes/metadata'),
  clients : require('./routes/clients'),
  file :  require('./routes/file'),
  folder : require('./routes/folder'),
  users : require('./routes/users'),
  accessLog : require('./routes/accessLog'),
  favourites : require('./routes/favourites')
}

app.use('/favourites', routes.favourites)
app.use('/accesslog', routes.accessLog)
app.use('/clients', routes.clients)
app.use('/client', routes.client)
app.use('/users', routes.users)
app.use('/file', routes.file)
app.use('/folder', routes.folder)
app.use('/metadata', routes.metadata)
 

/**
 * Start auto-removal interval
 */

 //Change this to how often autoremoval should run
const interval = 1000 * 60 * 15 //Run every 15 minutes
setInterval(autoRemoval.run, interval)

 /**
 * Start server
 */

const port = process.env.PORT || 8080;

  app.listen(port, () => {
    console.log("-----------------------------")
    console.log("Node.JS Backend API Started: http://localhost:%s", port)
    console.log("-----------------------------")
 })


 