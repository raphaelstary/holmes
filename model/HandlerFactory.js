var Config = require('./../Config');
var RegistrationHandler = require('./RegistrationHandler');
var AnalyticsHandler = require('./AnalyticsHandler');
var Checker = require('./Checker');
var getUUID = require('./generateUUID');
var CouchConnector = require('./CouchConnector');
var SystemEvent = require('./SystemEvent');
var DefaultEvent = require('./DefaultEvent');

var checker = new Checker(Config.TENANT_CODE, require('./validateClientId'));
var register = new RegistrationHandler(checker, getUUID);
var couchConnector = new CouchConnector(getUUID, Config.DB_HOSTNAME, Config.DB_PORT, Config.DB_NAME, Config.DB_USER,
    Config.DB_PASSWORD);
var defaultEvent = new DefaultEvent(couchConnector);
var systemEvent = new SystemEvent(defaultEvent);
var main = new AnalyticsHandler(checker, systemEvent, defaultEvent);

module.exports = {
    register: register,
    main: main
};