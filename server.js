//Install express server
const express = require('express');
const path = require('path');
var http = require('http');
var https = require('https');
var sslConfig = require('./ssl-config');
const bodyParser = require('body-parser');
const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/e-learning'));
// Tell the bodyparser middleware to accept more data: 10Gb
app.use(bodyParser.json({limit: '10240mb'}));
app.use(bodyParser.urlencoded({limit: '10240mb', extended: true}));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/e-learning/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8880);
https.createServer(sslConfig, app).listen(8881);