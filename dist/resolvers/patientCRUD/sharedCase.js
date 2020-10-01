"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.viewSharedCase = exports.createSharedCase = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var createSharedCase = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma,
        request = _ref.request;
    var result, user, medicalPractitioner, receiverMedicalPractitioner, patientCase, HL7, senderCheck, receiverCheck, sharedCase;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return createSharedCaseSchema.validate({
              case: args.data.case,
              receiver: args.data.receiver
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
            return prisma.query.medicalPractitioner({
              where: {
                mpId: args.data.receiver
              }
            }, "{ mpId user { verified } }");

          case 18:
            receiverMedicalPractitioner = _context.sent;

            if (receiverMedicalPractitioner) {
              _context.next = 23;
              break;
            }

            throw new Error("Medical Practitioner Not Found");

          case 23:
            if (!(receiverMedicalPractitioner.user.verified === true)) {
              _context.next = 26;
              break;
            }

            if (!(receiverMedicalPractitioner.mpId === medicalPractitioner.mpId)) {
              _context.next = 26;
              break;
            }

            throw new Error("Invalid Request");

          case 26:
            _context.next = 28;
            return prisma.query.patientCase({
              where: {
                caseId: args.data.case
              }
            }, "{\n    caseId\n    patient{\n      user{\n        firstName\n        middleName\n        lastName\n        sex\n        dob\n        email\n      }\n      patientId\n      bloodGroup\n      principleLanguage\n      motherName\n      aadharNo\n      religion\n      maritalStatus\n      primaryLanguage\n      birthPlace\n      address\n      pincode{\n          pincode\n          region\n        }\n      country{\n        countryCode\n        countryName\n      }\n      occupation\n      contact1\n      contact2\n      socioEcoStatus\n      immunizationHistory\n      allergyStatus\n      organDonorStatus\n      PMH\n      DHx\n      Ca\n      IDDM\n      NIDDM\n      COPD\n      MI\n      AF\n      cpId{\n        id\n        cpPatientId {\n          patientId\n          motherName\n          aadharNo\n          religion\n          maritalStatus\n          primaryLanguage\n          address\n          contact1\n          contact2\n          socioEcoStatus\n          country{\n            countryCode\n            countryName\n          }\n          user {\n            firstName\n            middleName\n            lastName\n            sex\n            dob\n            email\n            verified\n          }\n        }\n        cpPatientRelation\n      }\n      insurance{\n        insuranceId\n        insuranceStatus\n        insuranceCompany1\n        insuranceCompany2\n        sponsorerDetails\n      }\n    }\n    medicalPractitioner{\n      user{\n        firstName\n        middleName\n        lastName\n        sex\n        dob\n        email\n      }\n      mpId\n      address\n      clinicAddress\n      degree\n      field\n      hospital{\n        hospitalId\n        name\n        address\n        district\n        pincode{\n          pincode\n          region\n        }\n        country{\n          countryCode\n          countryName\n        }\n      }\n    }\n    icdCode{\n      icdCode\n      commonName\n    }\n    icdSubCode{\n      icdSubCode\n      scientificName\n    }\n    HPC\n    MoI\n    DandV\n    clinicalNote\n    noOfVisits\n    diagnosisType\n    currentClinicalStatus\n    createdAt\n    updatedAt\n    patientRecord{\n      recordId\n      medicalPractitioner{\n        user{\n          firstName\n          middleName\n          lastName\n          sex\n          dob\n          email\n        }\n        mpId\n        address\n        clinicAddress\n        degree\n        field\n        hospital{\n          hospitalId\n          name\n          address\n          district\n          pincode{\n            pincode\n            region\n          }\n          country{\n            countryCode\n            countryName\n          }\n        }\n      }\n      visitNo\n      onArrival\n      diagnosis\n      Tx\n      reportSuggestions\n      cevsSp\n      cevsDp\n      ceRr\n      cePr\n      ceWeight\n      ceHeight\n      diagnosisAfterReport\n      medication\n      advice\n      query\n      followUpObservations\n      createdAt\n    }\n  }");

          case 28:
            patientCase = _context.sent;
            _context.next = 31;
            return (0, _HL7_caller.genHL7)(JSON.stringify(patientCase), "case");

          case 31:
            HL7 = _context.sent;
            _context.next = 34;
            return prisma.query.sharedCases({
              where: {
                AND: [{
                  case: {
                    caseId: patientCase.caseId
                  }
                }, {
                  receiver: {
                    mpId: medicalPractitioner.mpId
                  }
                }]
              }
            }, "{ receiver {mpId} }");

          case 34:
            senderCheck = _context.sent;

            if (!(patientCase.medicalPractitioner.mpId !== medicalPractitioner.mpId)) {
              _context.next = 38;
              break;
            }

            if (!(senderCheck.length === 0)) {
              _context.next = 38;
              break;
            }

            throw new Error("Access Denied");

          case 38:
            if (!(patientCase.medicalPractitioner.mpId === receiverMedicalPractitioner.mpId)) {
              _context.next = 40;
              break;
            }

            throw new Error("Receiver is owner of Case");

          case 40:
            _context.next = 42;
            return prisma.query.sharedCases({
              where: {
                AND: [{
                  case: {
                    caseId: patientCase.caseId
                  }
                }, {
                  receiver: {
                    mpId: receiverMedicalPractitioner.mpId
                  }
                }]
              }
            }, "{ receiver {mpId} }");

          case 42:
            receiverCheck = _context.sent;

            if (!(receiverCheck.length > 0)) {
              _context.next = 45;
              break;
            }

            throw new Error("Already Shared");

          case 45:
            _context.next = 47;
            return prisma.mutation.createSharedCase({
              data: {
                HL7: HL7,
                case: {
                  connect: {
                    caseId: patientCase.caseId
                  }
                },
                sender: {
                  connect: {
                    mpId: medicalPractitioner.mpId
                  }
                },
                receiver: {
                  connect: {
                    mpId: receiverMedicalPractitioner.mpId
                  }
                }
              }
            }, info);

          case 47:
            sharedCase = _context.sent;
            return _context.abrupt("return", sharedCase);

          case 49:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createSharedCase(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var viewSharedCase = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma,
        request = _ref3.request;

    var userData, patientId, spread, where, cases, patient, _spread, _where, _cases, _cases2, mp, _patient, _where2, caseOwn, caseRecieve;

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
              _context2.next = 11;
              break;
            }

            spread = _extends({}, args.caseId && { case: { caseId: args.caseId } }, args.FromDate && { sharedAt_gte: args.FromDate }, args.ToDate && { sharedAt_lte: args.ToDate });
            where = {
              AND: [{
                case: {
                  patient: {
                    user: {
                      id: userData.id
                    }
                  }
                }
              }].concat(_toConsumableArray(Object.keys(spread).map(function (k) {
                return _defineProperty({}, k, spread[k]);
              })))
            };
            _context2.next = 9;
            return prisma.query.sharedCases({
              where: where,
              orderBy: "sharedAt_DESC"
            }, info);

          case 9:
            cases = _context2.sent;
            return _context2.abrupt("return", cases);

          case 11:
            if (!(userData.role === "DatabaseAdmin")) {
              _context2.next = 20;
              break;
            }

            patient = {};

            if (args.patientId.length === 16) {
              patient = {
                patientId: patientId
              };
            } else {
              patient = {
                id: patientId
              };
            }
            _spread = _extends({}, args.caseId && { case: { caseId: args.caseId } }, args.FromDate && { sharedAt_gte: args.FromDate }, args.ToDate && { sharedAt_lte: args.ToDate });
            _where = {
              AND: [{
                case: {
                  patient: patient
                }
              }].concat(_toConsumableArray(Object.keys(_spread).map(function (k) {
                return _defineProperty({}, k, _spread[k]);
              })))
            };
            _context2.next = 18;
            return prisma.query.sharedCases({
              where: _where,
              orderBy: "sharedAt_DESC"
            }, info);

          case 18:
            _cases = _context2.sent;
            return _context2.abrupt("return", _cases);

          case 20:
            if (!(userData.role === "MedicalPractitioner")) {
              _context2.next = 36;
              break;
            }

            _cases2 = [];
            _context2.next = 24;
            return prisma.query.medicalPractitioners({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, "{mpId hospital {hospitalId}}");

          case 24:
            mp = _context2.sent;
            _patient = {};

            if (args.patientId.length === 16) {
              _patient = {
                patientId: patientId
              };
            } else {
              _patient = {
                id: patientId
              };
            }
            _where2 = _extends({}, args.caseId && { case: { caseId: args.caseId } }, args.FromDate && { sharedAt_gte: args.FromDate }, args.ToDate && { sharedAt_lte: args.ToDate });
            _context2.next = 30;
            return prisma.query.sharedCases({
              where: {
                AND: [{
                  case: {
                    patient: _patient
                  }
                }, {
                  case: {
                    medicalPractitioner: {
                      user: {
                        id: userData.id
                      }
                    }
                  }
                }].concat(_toConsumableArray(Object.keys(_where2).map(function (k) {
                  return _defineProperty({}, k, _where2[k]);
                })))
              },
              orderBy: "sharedAt_DESC"
            }, info);

          case 30:
            caseOwn = _context2.sent;
            _context2.next = 33;
            return prisma.query.sharedCases({
              where: {
                AND: [{
                  case: {
                    patient: _patient
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
                  receiver: {
                    mpId: mp.mpId
                  }
                }].concat(_toConsumableArray(Object.keys(_where2).map(function (k) {
                  return _defineProperty({}, k, _where2[k]);
                })))
              },
              orderBy: "sharedAt_DESC"
            }, info);

          case 33:
            caseRecieve = _context2.sent;

            _cases2.push.apply(_cases2, _toConsumableArray(caseOwn).concat(_toConsumableArray(caseRecieve)));
            return _context2.abrupt("return", _cases2);

          case 36:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function viewSharedCase(_x5, _x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _getUserData = require("../../utils/getUserData");

var _getUserData2 = _interopRequireDefault(_getUserData);

var _HL7_caller = require("../../utils/HL7_caller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var createSharedCaseSchema = _joi2.default.object().keys({
  case: _joi2.default.string().required(),
  receiver: _joi2.default.string().required()
});

exports.createSharedCase = createSharedCase;
exports.viewSharedCase = viewSharedCase;