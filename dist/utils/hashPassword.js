'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hashPassword = function hashPassword(password) {
    if (password.length < 8) {
        throw new Error('Password must be greater than 8 character');
    }
    return _bcrypt2.default.hash(password, 10);
};

exports.default = hashPassword;