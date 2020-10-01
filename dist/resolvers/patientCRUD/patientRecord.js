"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewPatientRecord = exports.createPatientRecord = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var createPatientRecord = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma,
        request = _ref.request;
    var result, user, medicalPractitioner, patientCase, receiverCheck, prevPatientRecords, recordId, recordNum, visitNo, noOfVisits, updatePatientCase, patientRecord;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return createPatientRecordSchema.validate({
              case: args.data.case,
              onArrival: args.data.onArrival,
              diagnosis: args.data.diagnosis,
              Tx: args.data.Tx,
              reportSuggestions: args.data.reportSuggestions,
              cevsSp: args.data.cevsSp,
              cevsDp: args.data.cevsDp,
              cePr: args.data.cePr,
              ceRr: args.data.ceRr,
              ceHeight: args.data.ceHeight,
              ceWeight: args.data.ceWeight,
              diagnosisAfterReport: args.data.diagnosisAfterReport,
              medication: args.data.medication,
              advice: args.data.advice,
              query: args.data.query,
              followUpObservations: args.data.followUpObservations
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
            _context.next = 13;
            return prisma.query.patientCase({
              where: {
                caseId: args.data.case
              }
            }, "{ caseId noOfVisits medicalPractitioner { mpId } patient { patientId user{ verified } } }");

          case 13:
            patientCase = _context.sent;

            if (patientCase.patient.user.verified) {
              _context.next = 16;
              break;
            }

            throw new Error(" Patient Not Verified");

          case 16:
            if (patientCase) {
              _context.next = 18;
              break;
            }

            throw new Error("Invalid Patient");

          case 18:
            if (!(patientCase.medicalPractitioner.mpId !== medicalPractitioner[0].mpId)) {
              _context.next = 24;
              break;
            }

            _context.next = 21;
            return prisma.query.sharedCases({
              where: {
                AND: [{
                  case: {
                    caseId: patientCase.caseId
                  }
                }, {
                  receiver: {
                    mpId: medicalPractitioner[0].mpId
                  }
                }]
              }
            }, "{ receiver {mpId} }");

          case 21:
            receiverCheck = _context.sent;

            if (!(receiverCheck.length === 0)) {
              _context.next = 24;
              break;
            }

            throw new Error("Access Denied");

          case 24:
            _context.next = 26;
            return prisma.query.patientRecords({
              where: {
                patient: {
                  patientId: patientCase.patient.patientId
                }
              },
              orderBy: "recordId_DESC"
            }, "{ recordId }");

          case 26:
            prevPatientRecords = _context.sent;
            recordId = "";

            if (prevPatientRecords.length === 0) {
              recordId = patientCase.caseId + "0001";
            } else {
              recordNum = prevPatientRecords[0].recordId.substr(patientCase.caseId.length);

              recordNum = parseInt(recordNum, 10) + 1;
              recordId = "" + patientCase.caseId + (0, _misc.pad)(recordNum, 4);
            }

            visitNo = parseInt(prevPatientRecords.length, 10) + 1;
            noOfVisits = parseInt(patientCase.noOfVisits, 10) + 1;
            // increment patient case

            _context.next = 33;
            return prisma.mutation.updatePatientCase({
              where: {
                caseId: patientCase.caseId
              },
              data: {
                noOfVisits: noOfVisits
              }
            }, "{ caseId noOfVisits}");

          case 33:
            updatePatientCase = _context.sent;
            _context.next = 36;
            return prisma.mutation.createPatientRecord({
              data: {
                recordId: recordId,
                visitNo: visitNo,
                onArrival: args.data.onArrival,
                diagnosis: args.data.diagnosis,
                Tx: args.data.Tx,
                reportSuggestions: args.data.reportSuggestions,
                cevsSp: args.data.cevsSp,
                cevsDp: args.data.cevsDp,
                cePr: args.data.cePr,
                ceRr: args.data.ceRr,
                ceHeight: args.data.ceHeight,
                ceWeight: args.data.ceWeight,
                diagnosisAfterReport: args.data.diagnosisAfterReport,
                medication: args.data.medication,
                advice: args.data.advice,
                query: args.data.query,
                followUpObservations: args.data.followUpObservations,
                patient: {
                  connect: {
                    patientId: patientCase.patient.patientId
                  }
                },
                medicalPractitioner: {
                  connect: {
                    mpId: medicalPractitioner[0].mpId
                  }
                },
                case: {
                  connect: {
                    caseId: patientCase.caseId
                  }
                }
              }
            }, info);

          case 36:
            patientRecord = _context.sent;
            return _context.abrupt("return", patientRecord);

          case 38:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createPatientRecord(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var viewPatientRecord = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma,
        request = _ref3.request;

    var userData, caseId, where, records, _caseId, _where, _records, mp, _caseId2, _where2, casesRecordsOwn, casesOwn, recordsOwn, sameHospital, _records2;

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
            if (!(userData.role === "Patient")) {
              _context2.next = 11;
              break;
            }

            caseId = {};

            if (args.caseId.length === 20) {
              caseId = {
                caseId: args.caseId
              };
            } else {
              caseId = {
                id: args.caseId
              };
            }
            where = _extends({}, args.recordId && { recordId: args.recordId }, args.FromDate && { createdAt_gte: args.FromDate }, args.ToDate && { createdAt_lte: args.ToDate });
            _context2.next = 9;
            return prisma.query.patientRecords({
              where: {
                AND: [{
                  case: _extends({}, caseId)
                }, {
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

          case 9:
            records = _context2.sent;
            return _context2.abrupt("return", records);

          case 11:
            if (!(userData.role === "DatabaseAdmin")) {
              _context2.next = 19;
              break;
            }

            _caseId = {};

            if (args.caseId.length === 20) {
              _caseId = {
                caseId: args.caseId
              };
            } else {
              _caseId = {
                id: args.caseId
              };
            }
            _where = _extends({}, args.recordId && { recordId: args.recordId }, args.FromDate && { createdAt_gte: args.FromDate }, args.ToDate && { createdAt_lte: args.ToDate });
            _context2.next = 17;
            return prisma.query.patientRecords({
              where: {
                AND: [{
                  case: _extends({}, _caseId)
                }].concat(_toConsumableArray(Object.keys(_where).map(function (k) {
                  return _defineProperty({}, k, _where[k]);
                })))
              },
              orderBy: "createdAt_DESC"
            }, info);

          case 17:
            _records = _context2.sent;
            return _context2.abrupt("return", _records);

          case 19:
            if (!(userData.role === "MedicalPractitioner")) {
              _context2.next = 41;
              break;
            }

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
            _caseId2 = {};

            if (args.caseId.length === 20) {
              _caseId2 = {
                caseId: args.caseId
              };
            } else {
              _caseId2 = {
                id: args.caseId
              };
            }
            _where2 = _extends({}, args.recordId && { recordId: args.recordId }, args.FromDate && { createdAt_gte: args.FromDate }, args.ToDate && { createdAt_lte: args.ToDate });
            _context2.next = 28;
            return prisma.query.patientRecords({
              where: {
                AND: [{
                  case: _extends({}, _caseId2)
                }, {
                  case: {
                    medicalPractitioner: {
                      user: {
                        id: userData.id
                      }
                    }
                  }
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
            casesRecordsOwn = _context2.sent;
            _context2.next = 31;
            return prisma.query.patientRecords({
              where: {
                AND: [{
                  case: _extends({}, _caseId2)
                }, {
                  case: {
                    medicalPractitioner: {
                      user: {
                        id: userData.id
                      }
                    }
                  }
                }, {
                  medicalPractitioner: {
                    user: {
                      id_not: userData.id
                    }
                  }
                }].concat(_toConsumableArray(Object.keys(_where2).map(function (k) {
                  return _defineProperty({}, k, _where2[k]);
                })))
              },
              orderBy: "createdAt_DESC"
            }, info);

          case 31:
            casesOwn = _context2.sent;
            _context2.next = 34;
            return prisma.query.patientRecords({
              where: {
                AND: [{
                  case: _extends({}, _caseId2)
                }, {
                  case: {
                    medicalPractitioner: {
                      user: {
                        id_not: userData.id
                      }
                    }
                  }
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

          case 34:
            recordsOwn = _context2.sent;
            _context2.next = 37;
            return prisma.query.patientRecords({
              where: {
                AND: [{
                  case: _extends({}, _caseId2)
                }, {
                  medicalPractitioner: {
                    hospital: {
                      hospitalId: mp[0].hospital.hospitalId
                    }
                  }
                }, {
                  case: {
                    medicalPractitioner: {
                      user: {
                        id_not: userData.id
                      }
                    }
                  }
                }, {
                  medicalPractitioner: {
                    user: {
                      id_not: userData.id
                    }
                  }
                }].concat(_toConsumableArray(Object.keys(_where2).map(function (k) {
                  return _defineProperty({}, k, _where2[k]);
                })))
              },
              orderBy: "createdAt_DESC"
            }, info);

          case 37:
            sameHospital = _context2.sent;
            _records2 = [];

            _records2.push.apply(_records2, _toConsumableArray(casesOwn).concat(_toConsumableArray(recordsOwn), _toConsumableArray(sameHospital), _toConsumableArray(casesRecordsOwn)));
            return _context2.abrupt("return", _records2);

          case 41:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function viewPatientRecord(_x5, _x6, _x7, _x8) {
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

var createPatientRecordSchema = _joi2.default.object().keys({
  case: _joi2.default.string().required(),
  onArrival: _joi2.default.string().required(),
  diagnosis: _joi2.default.string().required(),
  Tx: _joi2.default.string().required(),
  reportSuggestions: _joi2.default.string(),
  cevsSp: _joi2.default.number().integer().required(),
  cevsDp: _joi2.default.number().integer().required(),
  cePr: _joi2.default.number().integer().required(),
  ceRr: _joi2.default.number().integer().required(),
  ceHeight: _joi2.default.number().integer().required(),
  ceWeight: _joi2.default.number().integer().required(),
  diagnosisAfterReport: _joi2.default.string(),
  medication: _joi2.default.string().required(),
  advice: _joi2.default.string().required(),
  query: _joi2.default.string().required(),
  followUpObservations: _joi2.default.string().required()
});

exports.createPatientRecord = createPatientRecord;
exports.viewPatientRecord = viewPatientRecord;