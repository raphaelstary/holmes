function DefaultEvent(dbConnection) {
    this.dbConnection = dbConnection;
}

DefaultEvent.prototype.handle = function (event) {
    event.time = Date.now();
    this.dbConnection.send(event);
};

module.exports = DefaultEvent;