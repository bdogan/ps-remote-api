var path = require('path'),
    fs = require('fs');

// Config cache
var data = {};

// Config Class
function Config () {
  this.basePath = path.resolve('./config');
}

// Config Read
Config.prototype.read = function(file, key) {
  try {
    if (!data.hasOwnProperty(file)) data[file] = JSON.parse(fs.readFileSync(path.join(this.basePath, file + '.json')));
    return data[file][key];
  } catch (err) {
    return undefined;
  }
};

// Clear Cache
Config.prototype.clearCache = function() {
  data = {};
};

// Module exports
module.exports = new Config();