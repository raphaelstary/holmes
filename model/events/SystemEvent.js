var console = require('./../utils/Logger');
var https = require('https');
var dns = require('dns');

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

        event.hostnames = hostnames;

        self.handler.handle(event);
    }

    var ip = startsWidth(request.ip, '::ffff:') ? request.ip.substring(7) : request.ip;

    if (ip == '127.0.0.1' || ip == '::1') {
        callback({
            ip: '127.0.0.1',
            country_name: 'localhost'
        });
        return;
    }

    dns.reverse(ip, function (error, hostnames) {
        if (error) {
            console.error(error.message);
            console.error(error.code);
            console.error(error.stack);
        }

        https.get('https://freegeoip.net/json/' + ip, function (response) {

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

function startsWidth(actualString, searchString) {
    return actualString.indexOf(searchString, 0) === 0;
}

module.exports = SystemEvent;