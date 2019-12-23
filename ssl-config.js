var path = require('path');
var fs = require('fs');

exports.key = fs.readFileSync(path.join(__dirname, './config/bv-privatekey.pem')).toString();
exports.cert = fs.readFileSync(path.join(__dirname, './config/bv-cert.pem')).toString();
