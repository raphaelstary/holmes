var console = require('./../utils/Logger');

function AnalyticsHandler(checker, systemEventHandler, defaultEventHandler) {
    this.checker = checker;
    this.system = systemEventHandler;
    this.default = defaultEventHandler;
}

AnalyticsHandler.prototype.handle = function (request, response) {
    var payload = request.body;
    var success = this.checker.validateTenant(payload.tenant) && this.checker.validateClient(payload.id);

    response.sendStatus(200);

    if (success) {
        if (payload.type == 'system') {
            this.system.handle(payload, request);
        } else {
            this.default.handle(payload);
        }

    } else {
        console.warn('corrupt data: ' + JSON.stringify(payload));
    }
};

module.exports = AnalyticsHandler;