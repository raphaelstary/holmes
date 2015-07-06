var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var PORT = 8088;

var RegistrationHandler = require('./model/RegistrationHandler');
var AnalyticsHandler = require('./model/AnalyticsHandler');
var Checker = require('./model/Checker');

var checker = new Checker(require('./model/TenantCode'), require('./model/validateClientId'));
var register = new RegistrationHandler(checker, require('./model/generateUUID'));
var main = new AnalyticsHandler(checker);

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/register', register.handle.bind(register));

app.post('/event', main.handle.bind(main));

var server = app.listen(PORT, function () {
    console.log('Holmes started listening on port ' + server.address().port);
});