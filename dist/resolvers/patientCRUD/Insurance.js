"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateInsurance = exports.addInsurance = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var addInsurance = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma,
        request = _ref.request;
    var result, user, patient, patInsurance;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return addInsuranceSchema.validate({
              insuranceStatus: args.data.insuranceStatus,
              insuranceCompany1: args.data.insuranceCompany1,
              insuranceCompany2: args.data.insuranceCompany2,
              sponsorerDetails: args.data.sponsorerDetails
            });

          case 2:
            result = _context.sent;

            if (!result.error) {
              _context.next = 5;
              break;
            }

            throw new Error("Invalid Data");

          case 5:
            user = (0, _getUserData2.default)(request);

            if (user.verified && user.role === "Patient") {
              _context.next = 8;
              break;
            }

            throw new Error("Access Denied");

          case 8:
            _context.next = 10;
            return prisma.query.patients({
              where: {
                user: {
                  id: user.id
                }
              }
            }, "{id patientId}");

          case 10:
            patient = _context.sent;

            if (!(patient.length > 0)) {
              _context.next = 18;
              break;
            }

            _context.next = 14;
            return prisma.mutation.createInsurance({
              data: {
                insuranceId: "" + patient[0].patientId,
                insuranceStatus: args.data.insuranceStatus,
                insuranceCompany1: args.data.insuranceCompany1,
                insuranceCompany2: args.data.insuranceCompany2,
                sponsorerDetails: args.data.sponsorerDetails,
                patient: {
                  connect: {
                    patientId: patient[0].patientId
                  }
                }
              }
            }, info);

          case 14:
            patInsurance = _context.sent;
            return _context.abrupt("return", patInsurance);

          case 18:
            throw new Error("Invalid Request");

          case 19:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function addInsurance(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var updateInsurance = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma,
        request = _ref3.request;
    var result, user, patient, patInsurance;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return updateInsuranceSchema.validate({
              insuranceStatus: args.data.insuranceStatus,
              insuranceCompany1: args.data.insuranceCompany1,
              insuranceCompany2: args.data.insuranceCompany2,
              sponsorerDetails: args.data.sponsorerDetails
            });

          case 2:
            result = _context2.sent;

            if (!result.error) {
              _context2.next = 5;
              break;
            }

            throw new Error("Invalid Data");

          case 5:
            user = (0, _getUserData2.default)(request);

            if (user.verified && user.role === "Patient") {
              _context2.next = 8;
              break;
            }

            throw new Error("Access Denied");

          case 8:
            _context2.next = 10;
            return prisma.query.patients({
              where: {
                user: {
                  id: user.id
                }
              }
            }, "{id patientId}");

          case 10:
            patient = _context2.sent;

            if (!(patient.length > 0)) {
              _context2.next = 18;
              break;
            }

            _context2.next = 14;
            return prisma.mutation.updateInsurance({
              data: _extends({}, args.data),
              where: {
                insuranceId: patient[0].patientId
              }
            }, info);

          case 14:
            patInsurance = _context2.sent;
            return _context2.abrupt("return", patInsurance);

          case 18:
            throw new Error("Invalid Request");

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function updateInsurance(_x5, _x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _getUserData = require("../../utils/getUserData");

var _getUserData2 = _interopRequireDefault(_getUserData);

var _misc = require("../../utils/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var addInsuranceSchema = _joi2.default.object().keys({
  insuranceStatus: _joi2.default.string().required(),
  insuranceCompany1: _joi2.default.string().required(),
  insuranceCompany2: _joi2.default.string().required(),
  sponsorerDetails: _joi2.default.string().required()
});
var updateInsuranceSchema = _joi2.default.object().keys({
  insuranceStatus: _joi2.default.string(),
  insuranceCompany1: _joi2.default.string(),
  insuranceCompany2: _joi2.default.string(),
  sponsorerDetails: _joi2.default.string()
});

exports.addInsurance = addInsurance;
exports.updateInsurance = updateInsurance;