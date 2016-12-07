function Checker(tenantCode, validateClient) {
    this.tenantCode = tenantCode;
    this.validateClientId = validateClient;
}

Checker.prototype.validateTenant = function (code) {
    return (code === this.tenantCode);
};

Checker.prototype.validateClient = function (id) {
    return this.validateClientId(id);
};

module.exports = Checker;