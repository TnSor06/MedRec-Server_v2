"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Patient = exports.viewPatient = exports.updatePatient = exports.registerPatient = exports.mePatient = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Joi$object$keys;

var mePatient = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma,
        request = _ref3.request;
    var userData, patient;
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
            _context2.next = 5;
            return prisma.query.patients({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, info);

          case 5:
            patient = _context2.sent;

            if (!(patient.length === 1)) {
              _context2.next = 10;
              break;
            }

            return _context2.abrupt("return", patient[0]);

          case 10:
            throw new Error("Invalid Request");

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function mePatient(_x5, _x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var viewPatient = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, _ref5, info) {
    var prisma = _ref5.prisma,
        request = _ref5.request;
    var userData, patient;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userData = (0, _getUserData2.default)(request);

            if (!(!userData.verified || userData.role === "Patient")) {
              _context3.next = 3;
              break;
            }

            throw new Error("Access Denied");

          case 3:
            patient = null;

            if (!(userData.verified && userData.role === "MedicalPractitioner")) {
              _context3.next = 14;
              break;
            }

            if (!(args.id.length === 16)) {
              _context3.next = 11;
              break;
            }

            _context3.next = 8;
            return prisma.query.patients({
              where: {
                AND: [{
                  patientId: args.id
                }, {
                  user: {
                    verified: true
                  }
                }]
              }
            }, info);

          case 8:
            patient = _context3.sent;
            _context3.next = 14;
            break;

          case 11:
            _context3.next = 13;
            return prisma.query.patients({
              where: {
                user: {
                  AND: [{
                    id: args.id
                  }, {
                    verified: true
                  }]
                }
              }
            }, info);

          case 13:
            patient = _context3.sent;

          case 14:
            if (!(userData.verified && userData.role === "DatabaseAdmin")) {
              _context3.next = 24;
              break;
            }

            if (!(args.id.length === 16)) {
              _context3.next = 21;
              break;
            }

            _context3.next = 18;
            return prisma.query.patients({
              where: {
                patientId: args.id
              }
            }, info);

          case 18:
            patient = _context3.sent;
            _context3.next = 24;
            break;

          case 21:
            _context3.next = 23;
            return prisma.query.patients({
              where: {
                user: {
                  id: args.id
                }
              }
            }, info);

          case 23:
            patient = _context3.sent;

          case 24:
            if (!(patient.length === 1)) {
              _context3.next = 28;
              break;
            }

            return _context3.abrupt("return", patient[0]);

          case 28:
            throw new Error("Invalid Request");

          case 29:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function viewPatient(_x9, _x10, _x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var registerPatient = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, args, _ref7, info) {
    var prisma = _ref7.prisma,
        request = _ref7.request;
    var result, emailTaken, hashedPassword, patCountry, patAadhar, patRegion, prevPatient, patientId, patUser, patient;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return registerPatientSchema.validate({
              firstName: args.data.firstName,
              middleName: args.data.middleName,
              lastName: args.data.lastName,
              dob: args.data.dob,
              sex: args.data.sex,
              email: args.data.email.toLowerCase(),
              password: args.data.password,
              address: args.data.address,
              principleLanguage: args.data.primaryLanguage,
              motherName: args.data.motherName,
              aadharNo: args.data.aadharNo,
              bloodGroup: args.data.bloodGroup,
              religion: args.data.religion,
              maritalStatus: args.data.maritalStatus,
              primaryLanguage: args.data.primaryLanguage,
              birthPlace: args.data.birthPlace,
              pincode: args.data.pincode,
              country: args.data.country,
              occupation: args.data.occupation,
              contact1: args.data.contact1,
              contact2: args.data.contact2,
              socioEcoStatus: args.data.socioEcoStatus,
              immunizationHistory: args.data.immunizationHistory,
              allergyStatus: args.data.allergyStatus,
              organDonorStatus: args.data.organDonorStatus,
              PMH: args.data.PMH,
              DHx: args.data.DHx,
              Ca: args.data.Ca,
              IDDM: args.data.IDDM,
              NIDDM: args.data.NIDDM,
              COPD: args.data.COPD,
              MI: args.data.MI,
              AF: args.data.AF
            });

          case 2:
            result = _context4.sent;

            if (!result.error) {
              _context4.next = 5;
              break;
            }

            throw new Error("Invalid Data");

          case 5:
            _context4.next = 7;
            return prisma.exists.User({
              email: args.data.email.toLowerCase()
            });

          case 7:
            emailTaken = _context4.sent;

            if (!emailTaken) {
              _context4.next = 12;
              break;
            }

            throw new Error("Invalid User");

          case 12:
            _context4.next = 14;
            return (0, _hashPassword2.default)(args.data.password);

          case 14:
            hashedPassword = _context4.sent;
            _context4.next = 17;
            return prisma.query.country({
              where: {
                countryCode: parseInt(args.data.country, 10)
              }
            }, "{ countryCode }");

          case 17:
            patCountry = _context4.sent;
            _context4.next = 20;
            return prisma.query.patients({
              where: {
                aadharNo: args.data.aadharNo
              }
            }, "{ patientId }");

          case 20:
            patAadhar = _context4.sent;

            if (!(patAadhar.length !== 0)) {
              _context4.next = 23;
              break;
            }

            throw new Error("Invalid Aadhar Number");

          case 23:
            _context4.next = 25;
            return prisma.query.region({
              where: {
                pincode: parseInt(args.data.pincode, 10)
              }
            }, "{ pincode }");

          case 25:
            patRegion = _context4.sent;
            _context4.next = 28;
            return prisma.query.patients({
              where: {
                patientId_starts_with: "" + patCountry.countryCode + patRegion.pincode
              },
              orderBy: "patientId_DESC"
            }, "{ patientId }");

          case 28:
            prevPatient = _context4.sent;
            patientId = "";

            if (prevPatient.length === 0) {
              patientId = "" + patCountry.countryCode + patRegion.pincode + "0000000001";
            } else {
              patientId = parseInt(prevPatient[0].patientId, 10) + 1;
              patientId = patientId.toString();
            }
            _context4.next = 33;
            return prisma.mutation.createUser({
              data: {
                firstName: (0, _misc.capitalizeFirstLetter)(args.data.firstName),
                middleName: (0, _misc.capitalizeFirstLetter)(args.data.middleName),
                lastName: (0, _misc.capitalizeFirstLetter)(args.data.lastName),
                searchName: args.data.firstName.toLowerCase() + "-" + args.data.middleName.toLowerCase() + "-" + args.data.lastName.toLowerCase(),
                dob: args.data.dob,
                sex: args.data.sex,
                email: args.data.email.toLowerCase(),
                role: "Patient",
                isAdmin: false,
                password: hashedPassword,
                verified: false
              }
            });

          case 33:
            patUser = _context4.sent;
            _context4.next = 36;
            return prisma.mutation.createPatient({
              data: {
                patientId: patientId,
                address: args.data.address,
                bloodGroup: args.data.bloodGroup,
                principleLanguage: args.data.primaryLanguage,
                motherName: args.data.motherName,
                aadharNo: args.data.aadharNo,
                religion: args.data.religion,
                maritalStatus: args.data.maritalStatus,
                primaryLanguage: args.data.primaryLanguage,
                birthPlace: args.data.birthPlace,
                occupation: args.data.occupation,
                contact1: args.data.contact1,
                contact2: args.data.contact2,
                socioEcoStatus: args.data.socioEcoStatus,
                immunizationHistory: args.data.immunizationHistory,
                allergyStatus: args.data.allergyStatus,
                organDonorStatus: args.data.organDonorStatus,
                PMH: args.data.PMH,
                DHx: args.data.DHx,
                Ca: args.data.Ca,
                IDDM: args.data.IDDM,
                NIDDM: args.data.NIDDM,
                COPD: args.data.COPD,
                MI: args.data.MI,
                AF: args.data.AF,
                user: {
                  connect: {
                    id: patUser.id
                  }
                },
                pincode: {
                  connect: {
                    pincode: patRegion.pincode
                  }
                },
                country: {
                  connect: {
                    countryCode: patCountry.countryCode
                  }
                }
              }
            });

          case 36:
            patient = _context4.sent;
            return _context4.abrupt("return", "Patient registered with id " + patientId + " and will be verified within 2-3 business days.");

          case 38:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function registerPatient(_x13, _x14, _x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var updatePatient = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, args, _ref9, info) {
    var prisma = _ref9.prisma,
        request = _ref9.request;
    var userData, result, patient, updatedUser, data, patCountry, patRegion, updatedPatient;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userData = (0, _getUserData2.default)(request);

            if (userData.verified) {
              _context5.next = 3;
              break;
            }

            throw new Error("Access Denied");

          case 3:
            _context5.next = 5;
            return updatePatientSchema.validate({
              password: args.data.password,
              address: args.data.address,
              religion: args.data.religion,
              maritalStatus: args.data.maritalStatus,
              primaryLanguage: args.data.primaryLanguage,
              occupation: args.data.occupation,
              contact1: args.data.contact1,
              contact2: args.data.contact2,
              socioEcoStatus: args.data.socioEcoStatus,
              immunizationHistory: args.data.immunizationHistory,
              allergyStatus: args.data.allergyStatus,
              organDonorStatus: args.data.organDonorStatus,
              PMH: args.data.PMH,
              DHx: args.data.DHx,
              Ca: args.data.Ca,
              IDDM: args.data.IDDM,
              NIDDM: args.data.NIDDM,
              COPD: args.data.COPD,
              MI: args.data.MI,
              AF: args.data.AF,
              pincode: args.data.pincode,
              country: args.data.country
            });

          case 5:
            result = _context5.sent;

            if (!result.error) {
              _context5.next = 8;
              break;
            }

            throw new Error("Invalid Data");

          case 8:
            _context5.next = 10;
            return prisma.query.patients({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, "{ id }");

          case 10:
            patient = _context5.sent;

            if (!(patient.length === 1)) {
              _context5.next = 37;
              break;
            }

            if (!(typeof args.data.password === "string")) {
              _context5.next = 20;
              break;
            }

            _context5.next = 15;
            return (0, _hashPassword2.default)(args.data.password);

          case 15:
            args.data.password = _context5.sent;
            _context5.next = 18;
            return prisma.mutation.updateUser({
              where: {
                id: userData.id
              },
              data: {
                password: args.data.password
              }
            });

          case 18:
            updatedUser = _context5.sent;

            delete args.data.password;

          case 20:
            data = _extends({}, args.data);

            if (!(typeof args.data.country === "string")) {
              _context5.next = 26;
              break;
            }

            _context5.next = 24;
            return prisma.query.country({
              where: {
                countryCode: parseInt(args.data.country, 10)
              }
            }, "{ countryCode }");

          case 24:
            patCountry = _context5.sent;

            data["country"] = {
              connect: {
                countryCode: patCountry.countryCode
              }
            };

          case 26:
            if (!(typeof args.data.pincode === "string")) {
              _context5.next = 31;
              break;
            }

            _context5.next = 29;
            return prisma.query.region({
              where: {
                pincode: parseInt(args.data.pincode, 10)
              }
            }, "{ pincode }");

          case 29:
            patRegion = _context5.sent;


            data.pincode = {
              connect: {
                pincode: patRegion.pincode
              }
            };

          case 31:
            _context5.next = 33;
            return prisma.mutation.updatePatient({
              where: {
                id: patient[0].id
              },
              data: data
            });

          case 33:
            updatedPatient = _context5.sent;
            return _context5.abrupt("return", "Update Successful");

          case 37:
            throw new Error("Invalid Request");

          case 38:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function updatePatient(_x17, _x18, _x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _hashPassword = require("../../utils/hashPassword");

var _hashPassword2 = _interopRequireDefault(_hashPassword);

var _getUserData = require("../../utils/getUserData");

var _getUserData2 = _interopRequireDefault(_getUserData);

var _misc = require("../../utils/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Patient = {
  patientCase: {
    fragment: "fragment patientId on Patient{ id patientId }",
    resolve: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
        var prisma = _ref.prisma,
            request = _ref.request;

        var userData, cases, _cases, mp, caseOwn, caseShared, sameHospital;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                userData = (0, _getUserData2.default)(request);

                if (!(userData.role === "DatabaseAdmin")) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", parent.patientCase);

              case 3:
                if (!(userData.role === "Patient")) {
                  _context.next = 8;
                  break;
                }

                _context.next = 6;
                return prisma.query.patientCases({
                  where: {
                    patient: {
                      id: parent.id
                    }
                  }
                }, info);

              case 6:
                cases = _context.sent;
                return _context.abrupt("return", cases);

              case 8:
                if (!(userData.role === "MedicalPractitioner")) {
                  _context.next = 24;
                  break;
                }

                _cases = [];
                _context.next = 12;
                return prisma.query.medicalPractitioners({
                  where: {
                    user: {
                      id: userData.id
                    }
                  }
                }, "{mpId hospital {hospitalId}}");

              case 12:
                mp = _context.sent;
                _context.next = 15;
                return prisma.query.patientCases({
                  where: {
                    AND: [{
                      patient: {
                        id: parent.id
                      }
                    }, {
                      medicalPractitioner: {
                        user: {
                          id: userData.id
                        }
                      }
                    }]
                  }
                }, info);

              case 15:
                caseOwn = _context.sent;
                _context.next = 18;
                return prisma.query.patientCases({
                  where: {
                    AND: [{
                      patient: {
                        id: parent.id
                      }
                    }, {
                      sharedCase_some: {
                        receiver: {
                          user: {
                            id: userData.id
                          }
                        }
                      }
                    }, {
                      medicalPractitioner: {
                        hospital: {
                          hospitalId_not: mp[0].hospital.hospitalId
                        }
                      }
                    }]
                  }
                }, info);

              case 18:
                caseShared = _context.sent;
                _context.next = 21;
                return prisma.query.patientCases({
                  where: {
                    AND: [{
                      patient: {
                        id: parent.id
                      }
                    }, {
                      sharedCase_some: {
                        receiver: {
                          hospital: {
                            hospitalId_not: mp[0].hospital.hospitalId
                          }
                        }
                      }
                    }, {
                      medicalPractitioner: {
                        hospital: {
                          hospitalId: mp[0].hospital.hospitalId
                        }
                      }
                    }]
                  }
                }, info);

              case 21:
                sameHospital = _context.sent;

                _cases.push.apply(_cases, _toConsumableArray(caseOwn).concat(_toConsumableArray(caseShared), _toConsumableArray(sameHospital)));
                return _context.abrupt("return", _cases);

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resolve(_x, _x2, _x3, _x4) {
        return _ref2.apply(this, arguments);
      }

      return resolve;
    }()
  }
};

var registerPatientSchema = _joi2.default.object().keys((_Joi$object$keys = {
  firstName: _joi2.default.string().required(),
  middleName: _joi2.default.string().required(),
  lastName: _joi2.default.string().required(),
  dob: _joi2.default.string().regex(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/).required(),
  sex: _joi2.default.string().valid("Male", "Female", "Transgender").required(),
  address: _joi2.default.string().required(),
  email: _joi2.default.string().lowercase().email().required(),
  password: _joi2.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8).required(),
  principleLanguage: _joi2.default.string().required(),
  motherName: _joi2.default.string().required(),
  aadharNo: _joi2.default.string().required(),
  bloodGroup: _joi2.default.string().required(),
  religion: _joi2.default.string().required(),
  maritalStatus: _joi2.default.string().required().valid("Single", "Married", "Divorced", "Widowed"),
  primaryLanguage: _joi2.default.string().required(),
  birthPlace: _joi2.default.string().required()
}, _defineProperty(_Joi$object$keys, "address", _joi2.default.string().required()), _defineProperty(_Joi$object$keys, "pincode", _joi2.default.string().required()), _defineProperty(_Joi$object$keys, "country", _joi2.default.string().required()), _defineProperty(_Joi$object$keys, "occupation", _joi2.default.string().required()), _defineProperty(_Joi$object$keys, "contact1", _joi2.default.string().regex(/^[+]\d{2,4}-\d{3}\d{3}\d{4}$/).required()), _defineProperty(_Joi$object$keys, "contact2", _joi2.default.string().regex(/^[+]\d{2,4}-\d{3}\d{3}\d{4}$/).required()), _defineProperty(_Joi$object$keys, "socioEcoStatus", _joi2.default.string().required()), _defineProperty(_Joi$object$keys, "immunizationHistory", _joi2.default.string().required()), _defineProperty(_Joi$object$keys, "allergyStatus", _joi2.default.boolean()), _defineProperty(_Joi$object$keys, "organDonorStatus", _joi2.default.boolean()), _defineProperty(_Joi$object$keys, "PMH", _joi2.default.string().required()), _defineProperty(_Joi$object$keys, "DHx", _joi2.default.string().required()), _defineProperty(_Joi$object$keys, "Ca", _joi2.default.boolean()), _defineProperty(_Joi$object$keys, "IDDM", _joi2.default.boolean()), _defineProperty(_Joi$object$keys, "NIDDM", _joi2.default.boolean()), _defineProperty(_Joi$object$keys, "COPD", _joi2.default.boolean()), _defineProperty(_Joi$object$keys, "MI", _joi2.default.boolean()), _defineProperty(_Joi$object$keys, "AF", _joi2.default.boolean()), _Joi$object$keys));
var updatePatientSchema = _joi2.default.object().keys({
  password: _joi2.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8),
  principleLanguage: _joi2.default.string(),
  motherName: _joi2.default.string(),
  aadharNo: _joi2.default.string(),
  religion: _joi2.default.string(),
  maritalStatus: _joi2.default.string().valid("Single", "Married", "Divorced", "Widowed"),
  primaryLanguage: _joi2.default.string(),
  address: _joi2.default.string(),
  pincode: _joi2.default.string(),
  country: _joi2.default.string(),
  occupation: _joi2.default.string(),
  contact1: _joi2.default.string().regex(/^[+]\d{2,4}-\d{3}\d{3}\d{4}$/),
  contact2: _joi2.default.string().regex(/^[+]\d{2,4}-\d{3}\d{3}\d{4}$/),
  socioEcoStatus: _joi2.default.string(),
  immunizationHistory: _joi2.default.string(),
  allergyStatus: _joi2.default.boolean(),
  organDonorStatus: _joi2.default.boolean(),
  PMH: _joi2.default.string(),
  DHx: _joi2.default.string(),
  Ca: _joi2.default.boolean(),
  IDDM: _joi2.default.boolean(),
  NIDDM: _joi2.default.boolean(),
  COPD: _joi2.default.boolean(),
  MI: _joi2.default.boolean(),
  AF: _joi2.default.boolean()
});
exports.mePatient = mePatient;
exports.registerPatient = registerPatient;
exports.updatePatient = updatePatient;
exports.viewPatient = viewPatient;
exports.Patient = Patient;