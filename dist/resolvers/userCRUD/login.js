"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = undefined;

var login = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma;
    var result, user, passwordMatch, token;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return loginSchema.validate({
              email: args.data.email,
              password: args.data.password
            });

          case 2:
            result = _context.sent;

            if (!result.error) {
              _context.next = 5;
              break;
            }

            throw new Error("Invalid Data");

          case 5:
            _context.next = 7;
            return prisma.query.user({
              where: {
                email: args.data.email
              }
            });

          case 7:
            user = _context.sent;

            if (user) {
              _context.next = 10;
              break;
            }

            throw new Error("Invalid User");

          case 10:
            _context.next = 12;
            return _bcrypt2.default.compare(args.data.password, user.password);

          case 12:
            passwordMatch = _context.sent;

            if (passwordMatch) {
              _context.next = 17;
              break;
            }

            throw new Error("Incorrect password");

          case 17:
            if (user.verified) {
              _context.next = 21;
              break;
            }

            throw new Error("Not verified");

          case 21:
            token = (0, _genUserToken2.default)(user);
            return _context.abrupt("return", {
              user: user,
              token: token
            });

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function login(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _genUserToken = require("../../utils/genUserToken");

var _genUserToken2 = _interopRequireDefault(_genUserToken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var loginSchema = _joi2.default.object().keys({
  email: _joi2.default.string().email().required(),
  password: _joi2.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8).required()
});

exports.login = login;