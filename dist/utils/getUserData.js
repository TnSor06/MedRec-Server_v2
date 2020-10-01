"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require("config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUserData = function getUserData(request) {
    var requireAuth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    // header from subscription : request.connection.context.Authorization
    var header = request.request ? request.request.headers.authorization : request.connection.context.Authorization;

    if (header) {
        var token = header.split(" ")[1];
        var decodedValues = _jsonwebtoken2.default.verify(token, _config2.default.get('secret-key'));
        var userData = {
            id: decodedValues.id,
            role: decodedValues.role,
            isAdmin: decodedValues.isAdmin,
            verified: decodedValues.verified
        };
        return userData;
    }
    if (requireAuth) {
        throw new Error("Auth required");
    }
    return null;
};
exports.default = getUserData;