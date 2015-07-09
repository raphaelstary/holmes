var https = require('http'); // todo change to https
var Config = require('./../Config');

function AnalyticsHandler(checker, getUUID) {
    this.checker = checker;
    this.getUUID = getUUID;
}

AnalyticsHandler.prototype.handle = function (request, response) {
    var payload = request.body;
    var success = this.checker.validateTenant(payload.tenant) && this.checker.validateClient(payload.id);

    response.sendStatus(200);

    if (success) {
        var body = JSON.stringify(payload);

        var options = {
            hostname: Config.DB_HOSTNAME,
            port: Config.DB_PORT,
            path: '/' + Config.DB_NAME + '/' + this.getUUID(),
            method: 'PUT',
            auth: Config.DB_USER + ':' + Config.DB_PASSWORD,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Content-Length': body.length
            }
        };

        var httpsRequest = https.request(options, function (httpsResponse) {
            if (httpsResponse.statusCode >= 400) {
                console.log('statusCode:', httpsResponse.statusCode);
                console.log('headers:', httpsResponse.headers);

                var body = '';
                httpsResponse.on('data', function (data) {
                    body += data;
                });
                httpsResponse.on('end', function () {
                    console.log('body:', JSON.parse(body));
                });
            }
        });

        httpsRequest.on('error', function (error) {
            console.error(error);
        });

        httpsRequest.write(body);
        httpsRequest.end();

    } else {
        console.log('corrupt data:', payload);
    }
};

module.exports = AnalyticsHandler;