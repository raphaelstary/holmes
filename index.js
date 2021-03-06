#!/usr/bin/env node

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');

var args = process.argv.slice(2);
var Config;
var flagIndex = args.indexOf('--config');
if (flagIndex != -1) {
    Config = require('./' + args[flagIndex + 1]);
} else {
    Config = require('./config'); // equals to --config config.json
}

var console = require('./model/utils/Logger');
var routes = require('./model/routes/createRoutes')(Config);

app.enable('trust proxy');
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/register', routes.register);
app.post('/event', routes.main);
app.get('/status', routes.getStatus);

var options = {
    key: fs.readFileSync(Config.SSL_KEY_PATH, 'utf8'),
    cert: fs.readFileSync(Config.SSL_CERT_PATH, 'utf8'),
    ca: fs.readFileSync(Config.SSL_CA_PATH, 'utf8'),
    dhparam: fs.readFileSync(Config.SSL_DH_PATH, 'utf8')
};

var server = https.createServer(options, app).listen(Config.PORT, function () {
    console.info('Holmes started listening on port ' + server.address().port);
});