var console = require('./Logger');
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

        event.hostnames = JSON.stringify(hostnames);

        self.handler.handle(event);
    }

    var ip = request.ip;
    var template = /^:(ffff)?:(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
    var hasIPv4Version = template.test(ip);
    if (hasIPv4Version) {
        ip.replace(/^.*:/, '');
    }

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

module.exports = SystemEvent;