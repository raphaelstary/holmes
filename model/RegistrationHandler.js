function RegistrationHandler(checker, generateId) {
    this.checker = checker;
    this.generateId = generateId;
}

RegistrationHandler.prototype.handle = function (request, response) {
    var success = this.checker.validateTenant(request.body.tenant);
    if (success)
        response.send(this.generateId());
    else
        response.sendStatus(200);
};

module.exports = RegistrationHandler;
