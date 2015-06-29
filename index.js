var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = 8088;

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/', function (req, res) {
    console.log(req.body);
    res.sendStatus(200);
});

var server = app.listen(PORT, function () {
    console.log('Holmes started listening on port ' + server.address().port);
});