var Service = require('node-windows').Service;
var path = require('path');
var config = require('./lib/config');

var user = config.read('service', 'user');
if (!user) return console.error('User config not found');

var port = config.read('service', 'port') ? parseInt(config.read('service', 'port'), 10) : 3000;
var log_level = config.read('service', 'log_level') || "warn";

// Create a new service object
var svc = new Service({
  name:'PowerShell Wrapper',
  description: 'Executes Powershell Functions',
  script: path.resolve('./index.js'),
  env: [{ name: "PORT", value: port }, { name: "LOG_LEVEL", value: log_level }, { name: "BASE_DIR", value: path.resolve('.') }]
});

// Define user properties
if (user.domain) svc.user.domain = user.domain;
if (user.account) svc.user.account = user.account;
if (user.password) svc.user.password = user.password;

// Install
svc.on('install',function(){
  console.log('Install Success!');
  svc.start();
});

// Uninstall complate
svc.on('uninstall', function(){
  console.log('Uninstall cuccess!');
  svc.install();
});

// Already Installed
svc.on('alreadyinstalled',function(){
  console.log('Already Installed. Uninstalling...');
  svc.uninstall();
});

// Install
svc.install();