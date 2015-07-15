var fs = require('fs');
var debug = true;

function log(logLevel, dataMsg) {
    var msg = Date() + ' ' + logLevel + ': ' + dataMsg + '\n';
        fs.appendFile('holmes.log', msg, function (err) {
            if (err) throw err;
            if (debug)
                console.log(msg);
        });
}

var Level = {
    LOG: '[LOG]',
    DEBUG: '[DEBUG]',
    INFO: '[INFO]',
    WARN: '[WARN]',
    ERROR: '[ERROR]'
};

var Logger = {
    log: log.bind(undefined, Level.LOG),
    debug: log.bind(undefined, Level.DEBUG),
    info: log.bind(undefined, Level.INFO),
    warn: log.bind(undefined, Level.WARN),
    error: log.bind(undefined, Level.ERROR)
};

module.exports = Logger;