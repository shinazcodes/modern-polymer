/*

  There are some minor modifications to the default Express setup
  Each is commented and marked with [SH] to make them easy to find

 */

var express = require('express');
var path = require('path');
var cors = require('cors');
var debug = require('debug')('MEAN-stack-authentication:server');
var http = require('http');
// [SH] Require Passport
var passport = require('passport');
var bodyParser = require('body-parser')
// BRING IN YOUR SCHEMAS & MODELS
require('./model/users');
// [SH] Bring in the data model
require('./model/db');
require('./model/purchases');
require('./model/customer');
// [SH] Bring in the Passport config after model is defined
require('./config/passport');




/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}


var permitCrossDomainRequests = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // some browsers send a pre-flight OPTIONS request to check if CORS is enabled so you have to also respond to that
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
};

// [SH] Bring in the routes for the API (delete the default routes)
var routesApi = require('./routes/index');

var app = express();
app.use(cors());
app.use(permitCrossDomainRequests);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

var port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//   // view engine setup
//   app.set('views', path.join(__dirname, 'views'));
//   app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

// [SH] Initialise Passport before using the route middleware
app.use(passport.initialize());

// [SH] Use the API routes when path starts with /api
app.use('/api', routesApi);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// [SH] Catch unauthorised errors
app.use(function (err, req, res, next) {
  if(req)
  console.log('request on ' + JSON.stringify(req));
  res.status(401);
  res.json({ "message": ""+req +"" + ": " + err.message });
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({ "message": err.name + ": " + err.message });
  }
});

//   // development error handler
//   // will print stacktrace
//   if (app.get('env') === 'development') {
//       app.use(function(err, req, res, next) {
//           res.status(err.status || 500);
//           res.render('error', {
//               message: err.message,
//               error: err
//           });
//       });
//   }

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  console.log('requestsvsdf on ');

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


module.exports = app;
