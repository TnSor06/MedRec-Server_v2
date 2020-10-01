"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.me = undefined;

var me = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
        var prisma = _ref.prisma,
            request = _ref.request;
        var userData, user;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        userData = (0, _getUserData2.default)(request);

                        if (userData.verified) {
                            _context.next = 3;
                            break;
                        }

                        throw new Error("Access Denied");

                    case 3:
                        _context.next = 5;
                        return prisma.query.user({
                            where: {
                                id: userData.id
                            }
                        }, info);

                    case 5:
                        user = _context.sent;
                        return _context.abrupt("return", user);

                    case 7:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function me(_x, _x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}();

var _getUserData = require("../../utils/getUserData");

var _getUserData2 = _interopRequireDefault(_getUserData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.me = me;