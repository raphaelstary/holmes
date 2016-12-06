var RegistrationHandler = require('./RegistrationHandler');
var AnalyticsHandler = require('./AnalyticsHandler');
var Checker = require('./Checker');
var getUUID = require('./generateUUID');
var CouchConnector = require('./CouchConnector');
var SystemEvent = require('./SystemEvent');
var DefaultEvent = require('./DefaultEvent');

function create(config) {
    var checker = new Checker(config.TENANT_CODE, require('./validateClientId'));
    var register = new RegistrationHandler(checker, getUUID);
    var couchConnector = new CouchConnector(getUUID, config.DB_HOSTNAME, config.DB_PORT, config.DB_NAME, config.DB_USER, config.DB_PASSWORD);
    var defaultEvent = new DefaultEvent(couchConnector);
    var systemEvent = new SystemEvent(defaultEvent);
    var main = new AnalyticsHandler(checker, systemEvent, defaultEvent);

    return {
        register: register,
        main: main
    };
}

module.exports = create;