function HealthCheck(dbConnection) {
    this.dbConnection = dbConnection;
}

HealthCheck.prototype.getStatus = function (request, response) {
    this.dbConnection.isHealthy(function (isHealthy) {
        if (isHealthy) {
            response.sendStatus(200);
        } else {
            response.sendStatus(500);
        }
    });
};
module.exports = HealthCheck;