"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegion = exports.getCountry = undefined;

var getCountry = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma;
    var result, name, country;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return query.validate({
              name: args.name,
              skip: args.skip
            });

          case 2:
            result = _context.sent;

            if (!result.error) {
              _context.next = 5;
              break;
            }

            throw new Error("Invalid Data");

          case 5:
            name = (0, _misc.capitalizeFirstLetter)(args.name);
            _context.next = 8;
            return prisma.query.countries({
              where: {
                countryName_contains: name
              },
              orderBy: "countryName_ASC",
              first: 10,
              skip: args.skip
            }, info);

          case 8:
            country = _context.sent;
            return _context.abrupt("return", country);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getCountry(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var getRegion = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma;
    var result, name, country;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return query.validate({
              name: args.name,
              skip: args.skip
            });

          case 2:
            result = _context2.sent;

            if (!result.error) {
              _context2.next = 5;
              break;
            }

            throw new Error("Invalid Data");

          case 5:
            name = (0, _misc.capitalizeFirstLetter)(args.name);
            _context2.next = 8;
            return prisma.query.regions({
              where: {
                region_contains: name
              },
              orderBy: "region_ASC",
              first: 10,
              skip: args.skip
            }, info);

          case 8:
            country = _context2.sent;
            return _context2.abrupt("return", country);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getRegion(_x5, _x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _misc = require("../../utils/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var query = _joi2.default.object().keys({
  name: _joi2.default.string().required(),
  skip: _joi2.default.number().required()
});

exports.getCountry = getCountry;
exports.getRegion = getRegion;