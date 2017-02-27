var SPCP = require('stateful-process-command-proxy');

// Proxy config
var proxyConfig = {
  name: config.read('default', 'name') || "default",
  max: config.read('default', 'max') ? parseInt(config.read('default', 'max'), 10) : 1,
  min: 1,
  idleTimeoutMS: config.read('default', 'idleTimeout') ? parseInt(config.read('default', 'idleTimeout'), 10) : 120000,

  logFunction: function(severity, origin, msg) {
    winston.log(severity,  origin + " " + msg);
  },

  processCommand: 'C:\\Windows\\system32\\WindowsPowerShell\\v1.0\\powershell.exe',
  processArgs:  ['-Command', '-'],
  processRetainMaxCmdHistory : config.read('default', 'maxHistory') ? parseInt(config.read('default', 'maxHistory'), 10) : 20,

  processInvalidateOnRegex : {
    'any':[],
    'stdout':[],
    'stderr':[{'regex':'.*error.*'}]
  },

  processCwd : config.read('default', 'cwd') || null,
  processEnvMap : null,
  processUid : null,
  processGid : null,

  initCommands: config.read('default', 'initScripts'),

  validateFunction: function(processProxy) {
    var isValid = processProxy.isValid();
    if(!isValid) winston.log('info',  "ProcessProxy.isValid() returns FALSE!");
    return isValid;
  }
};

// Export module
module.exports = new SPCP(proxyConfig);