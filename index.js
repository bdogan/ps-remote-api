process.stdin.resume();

// Global Logger
global.winston = new (require('winston').Logger)({
  transports: [
    new (require('winston').transports.Console)({'timestamp':true})
  ]
});

// Windows EventLogger
var winLog = null;
try {
  var EventLogger = require('node-windows').EventLogger;
  winLog = new EventLogger("Powershell NodeJS Wrapper");
} catch (err) {
  var winLog = null;
}

winston.on('logging', function (transport, level, msg, meta) {
  if (!winLog) return;
  winLog[winLog[level] ? level : 'info'](msg);
});

// Set Log Level
winston.level = process.env.LOG_LEVEL || 'info';
winston.log('info', 'Winston Log: ready', winston.level);

// Global config
global.config = require('./lib/config');

// Requirments
var express = require('express'),
    bodyParser = require('body-parser'),
    processProxy = require('./lib/process_proxy_config');

// Call express application
var app = express();

// Set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '4MB' }));

// Execute Command
app.post('/execute', function (req, res) {
  console.log(req.body.command);
  processProxy.executeCommand(req.body.command).then((result) => res.json(result)).catch(err => {
    winston.log('error', 'Error occured executing `' + req.body.command + '`.', err);
    res.sendStatus(500);
  })
});

// Get status
app.get('/status', function (req, res) {
  res.json(processProxy.getStatus());
});

app.get('*', function (req, res) {
  res.sendStatus(404);
});

// Load server
app.listen(process.env.PORT || 3000, function () {
  winston.log('info', "Server started on port " + (process.env.PORT || 3000).toString());
});

function exitHandler(options, err) {
  if (err) winston.log('error', err);
  if (options.cleanup) {
    processProxy.shutdown().then(() => {});
  }
  if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

