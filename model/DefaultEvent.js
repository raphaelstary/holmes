function DefaultEvent(dbConnection) {
    this.dbConnection = dbConnection;
}

DefaultEvent.prototype.handle = function (event) {
    event.time = Date.now();
    event.timeString = Date();

    this.dbConnection.send(event);
};

module.exports = DefaultEvent;