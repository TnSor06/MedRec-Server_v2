"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PatientCase = exports.viewPatientCase = exports.createPatientCase = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var createPatientCase = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma,
        request = _ref.request;
    var result, user, medicalPractitioner, patient, icdCode, icdSubCode, prevPatientCases, caseId, caseNum, patientCase;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return createPatientCaseSchema.validate({
              patientId: args.data.patientId,
              icdCode: args.data.icdCode,
              icdSubCode: args.data.icdSubCode,
              HPC: args.data.HPC,
              MoI: args.data.MoI,
              DandV: args.data.DandV,
              clinicalNote: args.data.clinicalNote,
              diagnosisType: args.data.diagnosisType,
              currentClinicalStatus: args.data.currentClinicalStatus
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

            if (user.verified && user.role === "MedicalPractitioner") {
              _context.next = 8;
              break;
            }

            throw new Error("Access Denied");

          case 8:
            _context.next = 10;
            return prisma.query.medicalPractitioners({
              where: {
                user: {
                  id: user.id
                }
              }
            }, "{ mpId }");

          case 10:
            medicalPractitioner = _context.sent;

            if (!(medicalPractitioner.length === 1)) {
              _context.next = 15;
              break;
            }

            medicalPractitioner = medicalPractitioner[0];
            _context.next = 16;
            break;

          case 15:
            throw new Error("Invalid Request");

          case 16:
            _context.next = 18;
            return prisma.query.patient({
              where: {
                patientId: args.data.patientId
              }
            }, "{ id patientId user { verified } }");

          case 18:
            patient = _context.sent;

            if (patient.user.verified) {
              _context.next = 21;
              break;
            }

            throw new Error(" Patient Not Verified");

          case 21:
            if (patient) {
              _context.next = 23;
              break;
            }

            throw new Error("Invalid Patient");

          case 23:
            _context.next = 25;
            return prisma.query.iCDCode({
              where: {
                icdCode: args.data.icdCode
              }
            }, "{ icdCode }");

          case 25:
            icdCode = _context.sent;

            if (icdCode) {
              _context.next = 28;
              break;
            }

            throw new Error("Invalid ICDCode");

          case 28:
            _context.next = 30;
            return prisma.query.iCDSubCode({
              where: {
                icdSubCode: args.data.icdSubCode
              }
            }, "{ icdSubCode }");

          case 30:
            icdSubCode = _context.sent;

            if (icdSubCode) {
              _context.next = 33;
              break;
            }

            throw new Error("Invalid ICDSubCode");

          case 33:
            _context.next = 35;
            return prisma.query.patientCases({
              where: {
                patient: {
                  patientId: patient.patientId
                }
              },
              orderBy: "caseId_DESC"
            }, "{ caseId }");

          case 35:
            prevPatientCases = _context.sent;
            caseId = "";

            if (prevPatientCases.length === 0) {
              caseId = patient.patientId + "0001";
            } else {
              caseNum = prevPatientCases[0].caseId.substr(patient.patientId.length);

              caseNum = parseInt(caseNum, 10) + 1;
              caseId = "" + patient.patientId + (0, _misc.pad)(caseNum, 4);
            }

            _context.next = 40;
            return prisma.mutation.createPatientCase({
              data: {
                caseId: caseId,
                HPC: args.data.HPC,
                MoI: args.data.MoI,
                DandV: args.data.DandV,
                clinicalNote: args.data.clinicalNote,
                noOfVisits: 0,
                diagnosisType: args.data.diagnosisType,
                currentClinicalStatus: args.data.currentClinicalStatus,
                patient: {
                  connect: {
                    id: patient.id
                  }
                },
                medicalPractitioner: {
                  connect: {
                    mpId: medicalPractitioner.mpId
                  }
                },
                icdCode: {
                  connect: {
                    icdCode: icdCode.icdCode
                  }
                },
                icdSubCode: {
                  connect: {
                    icdSubCode: icdSubCode.icdSubCode
                  }
                }
              }
            }, info);

          case 40:
            patientCase = _context.sent;
            return _context.abrupt("return", patientCase);

          case 42:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createPatientCase(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var viewPatientCase = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma,
        request = _ref3.request;

    var userData, patientId, where, cases, patient, _where, _cases, _cases2, mp, _patient, _where2, caseOwn, sameHospital;

    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userData = (0, _getUserData2.default)(request);

            if (userData.verified) {
              _context2.next = 3;
              break;
            }

            throw new Error("Access Denied");

          case 3:
            patientId = args.patientId;

            if (!(userData.role === "Patient")) {
              _context2.next = 10;
              break;
            }

            where = _extends({}, args.caseId && { caseId: args.caseId }, args.FromDate && { createdAt_gte: args.FromDate }, args.ToDate && { createdAt_lte: args.ToDate });
            _context2.next = 8;
            return prisma.query.patientCases({
              where: {
                AND: [{
                  patient: {
                    user: {
                      id: userData.id
                    }
                  }
                }].concat(_toConsumableArray(Object.keys(where).map(function (k) {
                  return _defineProperty({}, k, where[k]);
                })))
              },
              orderBy: "createdAt_DESC"
            }, info);

          case 8:
            cases = _context2.sent;
            return _context2.abrupt("return", cases);

          case 10:
            if (!(userData.role === "DatabaseAdmin")) {
              _context2.next = 18;
              break;
            }

            patient = {};

            if (args.patientId.length === 16) {
              patient = {
                patientId: patientId
              };
            } else {
              patient = {
                user: {
                  id: patientId
                }
              };
            }
            _where = _extends({}, args.caseId && { caseId: args.caseId }, args.FromDate && { createdAt_gte: args.FromDate }, args.ToDate && { createdAt_lte: args.ToDate });
            _context2.next = 16;
            return prisma.query.patientCases({
              where: {
                AND: [{ patient: patient }].concat(_toConsumableArray(Object.keys(_where).map(function (k) {
                  return _defineProperty({}, k, _where[k]);
                })))
              },
              orderBy: "createdAt_DESC"
            }, info);

          case 16:
            _cases = _context2.sent;
            return _context2.abrupt("return", _cases);

          case 18:
            if (!(userData.role === "MedicalPractitioner")) {
              _context2.next = 34;
              break;
            }

            _cases2 = [];
            _context2.next = 22;
            return prisma.query.medicalPractitioners({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, "{mpId hospital {hospitalId}}");

          case 22:
            mp = _context2.sent;
            _patient = {};

            if (args.patientId.length === 16) {
              _patient = {
                patientId: patientId
              };
            } else {
              _patient = {
                user: {
                  id: patientId
                }
              };
            }
            _where2 = _extends({}, args.caseId && { caseId: args.caseId }, args.FromDate && { createdAt_gte: args.FromDate }, args.ToDate && { createdAt_lte: args.ToDate });
            _context2.next = 28;
            return prisma.query.patientCases({
              where: {
                AND: [{
                  patient: _patient
                }, {
                  medicalPractitioner: {
                    user: {
                      id: userData.id
                    }
                  }
                }].concat(_toConsumableArray(Object.keys(_where2).map(function (k) {
                  return _defineProperty({}, k, _where2[k]);
                })))
              },
              orderBy: "createdAt_DESC"
            }, info);

          case 28:
            caseOwn = _context2.sent;
            _context2.next = 31;
            return prisma.query.patientCases({
              where: {
                AND: [{
                  patient: _patient
                }, {
                  medicalPractitioner: {
                    hospital: {
                      hospitalId: mp[0].hospital.hospitalId
                    }
                  }
                }, {
                  medicalPractitioner: {
                    id_not: userData.id
                  }
                }].concat(_toConsumableArray(Object.keys(_where2).map(function (k) {
                  return _defineProperty({}, k, _where2[k]);
                })))
              },
              orderBy: "createdAt_DESC"
            }, info);

          case 31:
            sameHospital = _context2.sent;

            _cases2.push.apply(_cases2, _toConsumableArray(caseOwn).concat(_toConsumableArray(sameHospital)));
            return _context2.abrupt("return", _cases2);

          case 34:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function viewPatientCase(_x5, _x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _getUserData = require("../../utils/getUserData");

var _getUserData2 = _interopRequireDefault(_getUserData);

var _misc = require("../../utils/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var PatientCase = {
  patientRecord: {
    fragment: "fragment case on PatientCase{ caseId }"
  }
};

var createPatientCaseSchema = _joi2.default.object().keys({
  patientId: _joi2.default.string().required(),
  icdCode: _joi2.default.string().required(),
  icdSubCode: _joi2.default.string().required(),
  HPC: _joi2.default.string().required(),
  MoI: _joi2.default.string(),
  DandV: _joi2.default.string(),
  clinicalNote: _joi2.default.string().required(),
  diagnosisType: _joi2.default.string().valid("Provisional", "Final", "Interim"),
  currentClinicalStatus: _joi2.default.boolean().required()
});

exports.createPatientCase = createPatientCase;
exports.viewPatientCase = viewPatientCase;
exports.PatientCase = PatientCase;