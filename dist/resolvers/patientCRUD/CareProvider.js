"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateCareProvider = exports.addCareProvider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var addCareProvider = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma,
        request = _ref.request;
    var result, user, patient, cpPatientDetail, patCareProvider;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return addCareProviderSchema.validate({
              cpPatientId: args.data.cpPatientId,
              cpPatientRelation: args.data.cpPatientRelation
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
            _context.next = 13;
            return prisma.query.patients({
              where: {
                AND: [{
                  patientId: args.data.cpPatientId
                }, {
                  user: {
                    verified: true
                  }
                }]
              }
            });

          case 13:
            cpPatientDetail = _context.sent;

            if (!(cpPatientDetail.length === 0)) {
              _context.next = 16;
              break;
            }

            throw new Error("No patient exists for care provider");

          case 16:
            if (!(patient.length > 0)) {
              _context.next = 23;
              break;
            }

            _context.next = 19;
            return prisma.mutation.createCareProvider({
              data: {
                cpPatientId: {
                  connect: {
                    patientId: args.data.cpPatientId
                  }
                },
                cpPatientRelation: args.data.cpPatientRelation,
                patient: {
                  connect: {
                    patientId: patient[0].patientId
                  }
                }
              }
            }, info);

          case 19:
            patCareProvider = _context.sent;
            return _context.abrupt("return", patCareProvider);

          case 23:
            throw new Error("Invalid Request");

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function addCareProvider(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var updateCareProvider = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma,
        request = _ref3.request;
    var result, user, patient, data, cpPatientDetail, patCareProvider;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return updateCareProviderSchema.validate({
              cpPatientId: args.data.cpaddress,
              cpPatientRelation: args.data.cpPatientRelation
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
            }, "{id patientId cpId{ id }}");

          case 10:
            patient = _context2.sent;

            if (!(patient.length > 0)) {
              _context2.next = 26;
              break;
            }

            data = _extends({}, args.data);

            if (!(typeof args.data.cpPatientId === "string")) {
              _context2.next = 20;
              break;
            }

            _context2.next = 16;
            return prisma.query.patients({
              where: {
                AND: [{
                  patientId: args.data.cpPatientId
                }, {
                  user: {
                    verified: true
                  }
                }]
              }
            });

          case 16:
            cpPatientDetail = _context2.sent;

            if (!(cpPatientDetail.length === 0)) {
              _context2.next = 19;
              break;
            }

            throw new Error("No patient exists for care provider");

          case 19:
            data.cpPatientId = {
              connect: {
                patientId: args.data.cpPatientId
              }
            };

          case 20:
            _context2.next = 22;
            return prisma.mutation.updateCareProvider({
              data: data,
              where: {
                id: patient[0].cpId.id
              }
            }, info);

          case 22:
            patCareProvider = _context2.sent;
            return _context2.abrupt("return", patCareProvider);

          case 26:
            throw new Error("Invalid Request");

          case 27:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function updateCareProvider(_x5, _x6, _x7, _x8) {
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

var addCareProviderSchema = _joi2.default.object().keys({
  cpPatientId: _joi2.default.string().required(),
  cpPatientRelation: _joi2.default.string().required()
});
var updateCareProviderSchema = _joi2.default.object().keys({
  cpPatientId: _joi2.default.string(),
  cpPatientRelation: _joi2.default.string()
});

exports.addCareProvider = addCareProvider;
exports.updateCareProvider = updateCareProvider;