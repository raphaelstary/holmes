var console = require('./../utils/Logger');
var http = require('http'); // todo change to https when DB has its own instance

function CouchConnector(getUUID, dbHostName, dbPort, dbName, dbUser, dbPassword) {
    this.getUUID = getUUID;
    this.host = dbHostName;
    this.port = dbPort;
    this.name = dbName;
    this.user = dbUser;
    this.password = dbPassword;
}

CouchConnector.prototype.isHealthy = function (callback) {
    http.get('http://' + this.host + ':' + this.port, function (response) {
        if (response.statusCode !== 200) {
            callback(true);
        } else {
            console.warn('couchDB returned status code: ' + response.statusCode);
            callback(false);
        }
    }).on('error', function (error) {
        console.error(error.message);
        console.error(error.stack);
        console.error(error);

        callback(false);
    });
};

CouchConnector.prototype.send = function (event) {
    var body = JSON.stringify(event);

    var options = {
        hostname: this.host,
        port: this.port,
        path: '/' + this.name + '/' + this.getUUID(),
        method: 'PUT',
        auth: this.user + ':' + this.password,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    };

    var request = http.request(options, function (response) {
        if (response.statusCode >= 400) {
            console.warn('statusCode: ' + response.statusCode);
            console.warn('headers: ' + JSON.stringify(response.headers));

            var body = '';
            response.on('data', function (data) {
                body += data;
            });
            response.on('end', function () {
                console.warn('body: ' + body);
            });
        }
    });

    request.on('error', function (error) {
        console.error(error.message);
        console.error(error.stack);
    });

    request.write(body);
    request.end();
};

module.exports = CouchConnector;