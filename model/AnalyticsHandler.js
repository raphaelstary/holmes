function AnalyticsHandler(checker) {
    this.checker = checker;
}

AnalyticsHandler.prototype.handle = function (request, response) {
    var payload = request.body;
    var success = this.checker.validateTenant(payload.tenant) && this.checker.validateClient(payload.id);
    if (success) {
        console.log('analytics stored');
    } else {
        console.log('corrupt data');
    }
    response.sendStatus(200);
};

module.exports = AnalyticsHandler;