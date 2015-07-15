var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var https = require('https');
var fs = require('fs');

var console = require('./model/Logger');
var Config = require('./Config');
var factory = require('./model/HandlerFactory');
var register = factory.register;
var main = factory.main;

app.enable('trust proxy');
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/register', register.handle.bind(register));

app.post('/event', main.handle.bind(main));

var options = {
    key: fs.readFileSync(Config.SSL_KEY_PATH, 'utf8'),
    cert: fs.readFileSync(Config.SSL_CERT_PATH, 'utf8'),
    passphrase: Config.SSL_PASSPHRASE
};

var server = https.createServer(options, app).listen(Config.PORT, function () {
    console.info('Holmes started listening on port ' + server.address().port);
});