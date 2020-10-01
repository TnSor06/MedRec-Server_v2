"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHospital = undefined;

var getHospital = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma;
    var result, name, hospital;
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
            return prisma.query.hospitals({
              where: {
                searchName_contains: name.toLowerCase().replace(" ", "-")
              },
              orderBy: "searchName_ASC",
              first: 20,
              skip: args.skip
            }, info);

          case 8:
            hospital = _context.sent;
            return _context.abrupt("return", hospital);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getHospital(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
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

exports.getHospital = getHospital;