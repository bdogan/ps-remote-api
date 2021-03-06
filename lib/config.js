var path = require('path'),
    fs = require('fs');

// Config cache
var data = {};

// Config Class
function Config () {
  this.basePath = process.env.BASE_DIR ? path.join(process.env.BASE_DIR, 'config') : path.resolve('./config');
}

// Config Read
Config.prototype.read = function(file, key) {
  try {
    if (!data.hasOwnProperty(file)) data[file] = JSON.parse(fs.readFileSync(path.join(this.basePath, file + '.json')));
    return data[file][key];
  } catch (err) {
    winston.log('error', 'Error reading ' + file + ' with key ' + key);
    winston.log('error', 'baseDir: ' + this.basePath);
    winston.log('error', 'file: ' + path.join(this.basePath, file + '.json'));
    return undefined;
  }
};

// Clear Cache
Config.prototype.clearCache = function() {
  data = {};
};

// Module exports
module.exports = new Config();