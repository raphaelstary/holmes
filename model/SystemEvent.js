var console = require('./Logger');
var https = require('https');

function SystemEvent(defaultHandler) {
    this.handler = defaultHandler;
}

SystemEvent.prototype.handle = function (event, request) {
    var self = this;

    function callback(geoData, hostnames) {
        event.ip = geoData.ip;
        event.country_code = geoData.country_code;
        event.country_name = geoData.country_name;
        event.time_zone = geoData.time_zone;
        event.latitude = geoData.latitude;
        event.longitude = geoData.longitude;

        event.hostnames = JSON.stringify(hostnames);

        self.handler.handle(event);
    }

    if (request.ip == '127.0.0.1' || request.ip == '::1') {
        callback({
            ip: '127.0.0.1',
            country_name: 'localhost'
        });
        return;
    }

    dns.reverse(request.ip, function (error, hostnames) {
        if (error) {
            console.error(error.message);
            console.error(error.code);
            console.error(error.stack);
        }

        https.get('https://freegeoip.net/json/' + request.ip, function (response) {

            var body = '';
            response.on('data', function (data) {
                body += data;
            });
            response.on('end', function () {
                callback(JSON.parse(body), hostnames);
            });

            if (response.statusCode >= 400) {
                console.warn('statusCode: ' + response.statusCode);
                console.warn('headers: ' + JSON.stringify(response.headers));
            }
        }).on('error', function (error) {
            console.error(error.message);
            console.error(error.stack);
            console.error(error);
        });
    });
};

module.exports = SystemEvent;