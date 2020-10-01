"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = exports.searchUser = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var searchUser = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref2, info) {
    var prisma = _ref2.prisma,
        request = _ref2.request;

    var userData, result, type, users, _users, _type, _users2, _users3;

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
            return searchUserSchema.validate({
              name: args.data.name,
              email: args.data.email,
              type: args.data.type
            });

          case 5:
            result = _context.sent;

            if (!result.error) {
              _context.next = 8;
              break;
            }

            throw new Error("Invalid Data");

          case 8:
            if (!(typeof args.data.email === "string")) {
              _context.next = 23;
              break;
            }

            type = args.data.type ? args.data.type : null;

            if (!type) {
              _context.next = 17;
              break;
            }

            _context.next = 13;
            return prisma.query.users({
              where: {
                AND: [{
                  email_starts_with: args.data.email.toLowerCase()
                }, {
                  role: args.data.type
                }, _extends({}, userData.role !== "DatabaseAdmin" && { verified: true })]
              },
              orderBy: "firstName_ASC",
              first: 10
            }, info);

          case 13:
            users = _context.sent;
            return _context.abrupt("return", users);

          case 17:
            _context.next = 19;
            return prisma.query.users({
              where: {
                AND: [{
                  email_starts_with: args.data.email.toLowerCase()
                }, {
                  role_not: "DatabaseAdmin"
                }, _extends({}, userData.role !== "DatabaseAdmin" && { verified: true })]
              },
              orderBy: "firstName_ASC",
              first: 10
            }, info);

          case 19:
            _users = _context.sent;
            return _context.abrupt("return", _users);

          case 21:
            _context.next = 39;
            break;

          case 23:
            if (!(typeof args.data.name === "string")) {
              _context.next = 38;
              break;
            }

            _type = args.data.type ? args.data.type : null;

            if (!_type) {
              _context.next = 32;
              break;
            }

            _context.next = 28;
            return prisma.query.users({
              where: {
                AND: [{
                  searchName_contains: args.data.name.toLowerCase().replace(" ", "-")
                }, {
                  role: args.data.type
                }, _extends({}, userData.role !== "DatabaseAdmin" && { verified: true })]
              },
              orderBy: "searchName_ASC",
              first: 10
            }, info);

          case 28:
            _users2 = _context.sent;
            return _context.abrupt("return", _users2);

          case 32:
            _context.next = 34;
            return prisma.query.users({
              where: {
                AND: [{
                  searchName_contains: args.data.name.toLowerCase().replace(" ", "-")
                }, {
                  role_not: "DatabaseAdmin"
                }, _extends({}, userData.role !== "DatabaseAdmin" && { verified: true })]
              },
              orderBy: "searchName_ASC",
              first: 10
            }, info);

          case 34:
            _users3 = _context.sent;
            return _context.abrupt("return", _users3);

          case 36:
            _context.next = 39;
            break;

          case 38:
            throw new Error("Enter a Name or Email");

          case 39:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function searchUser(_x, _x2, _x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _getUserData = require("../../utils/getUserData");

var _getUserData2 = _interopRequireDefault(_getUserData);

var _misc = require("../../utils/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var User = {
  password: {
    fragment: "fragment userId on User { id }",
    resolve: function resolve(parent, args, _ref, info) {
      var prisma = _ref.prisma,
          request = _ref.request;

      return "abcdefgh";
    }
  }
};

var searchUserSchema = _joi2.default.object().keys({
  type: _joi2.default.string().valid("Patient", "MedicalPractitioner"),
  email: _joi2.default.string().lowercase(),
  name: _joi2.default.string()
});

exports.searchUser = searchUser;
exports.User = User;