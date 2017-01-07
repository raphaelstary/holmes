var console = require('./../utils/Logger');
var https = require('https');

function SystemEvent(defaultHandler) {
    this.handler = defaultHandler;
}

SystemEvent.prototype.handle = function (event, request) {
    var self = this;

    function callback(geoData) {
        event.country_code = geoData.country_code;
        event.country_name = geoData.country_name;
        event.time_zone = geoData.time_zone;
        event.region_name = geoData.region_name;
        event.city = geoData.city;

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

    https.get('https://freegeoip.net/json/' + ip, function (response) {

        var body = '';
        response.on('data', function (data) {
            body += data;
        });
        response.on('end', function () {
            callback(JSON.parse(body));
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
};

function startsWidth(actualString, searchString) {
    return actualString.indexOf(searchString, 0) === 0;
}

module.exports = SystemEvent;