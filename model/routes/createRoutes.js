var RegistrationHandler = require('./RegistrationHandler');
var AnalyticsHandler = require('./AnalyticsHandler');
var Checker = require('./../validation/Checker');
var getUUID = require('./../utils/generateUUID');
var CouchConnector = require('./../core/CouchConnector');
var SystemEvent = require('./../events/SystemEvent');
var DefaultEvent = require('./../events/DefaultEvent');
var HealthCheck = require('./HealthCheck');

function createRoutes(config) {
    var checker = new Checker(config.TENANT_CODE, require('./../validation/validateClientId'));
    var register = new RegistrationHandler(checker, getUUID);
    var couchConnector = new CouchConnector(getUUID, config.DB_HOSTNAME, config.DB_PORT, config.DB_NAME, config.DB_USER, config.DB_PASSWORD);
    var defaultEvent = new DefaultEvent(couchConnector);
    var systemEvent = new SystemEvent(defaultEvent);
    var main = new AnalyticsHandler(checker, systemEvent, defaultEvent);
    var status = new HealthCheck(couchConnector);

    return {
        register: register.handle.bind(register),
        main: main.handle.bind(main),
        getStatus: status.getStatus.bind(status)
    };
}

module.exports = createRoutes;