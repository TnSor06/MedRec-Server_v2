'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// JWT for data transmission for authtoken and authorization
var genUserToken = function genUserToken(user) {
    var token = _jsonwebtoken2.default.sign({
        id: user.id,
        role: user.role,
        isAdmin: user.isAdmin,
        verified: user.verified
    }, _config2.default.get('secret-key'), {
        expiresIn: "3 days"
    });
    return token;
};

exports.default = genUserToken;