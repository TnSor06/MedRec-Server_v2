"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.approvePatient = exports.approveMedicalPractitioner = exports.updateDatabaseAdmin = exports.registerDatabaseAdmin = exports.meDatabaseAdmin = undefined;

var meDatabaseAdmin = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma,
        request = _ref.request;
    var userData, databaseAdmin;
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
            return prisma.query.databaseAdmins({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, info);

          case 5:
            databaseAdmin = _context.sent;

            if (!(databaseAdmin.length === 1)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", databaseAdmin[0]);

          case 10:
            throw new Error("Invalid Request");

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function meDatabaseAdmin(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var approvePatient = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma,
        request = _ref3.request;
    var userData, patient, updatedUser;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userData = (0, _getUserData2.default)(request);

            if (!(!userData.verified && userData.role !== "DatabaseAdmin")) {
              _context2.next = 3;
              break;
            }

            throw new Error("Access Denied");

          case 3:
            _context2.next = 5;
            return prisma.query.patient({
              where: {
                patientId: args.data.id
              }
            }, "{ id user{ id verified } }");

          case 5:
            patient = _context2.sent;

            if (!(patient.user.verified === false)) {
              _context2.next = 13;
              break;
            }

            _context2.next = 9;
            return prisma.mutation.updateUser({
              where: {
                id: patient.user.id
              },
              data: {
                verified: true
              }
            });

          case 9:
            updatedUser = _context2.sent;
            return _context2.abrupt("return", "Patient Verified");

          case 13:
            throw new Error("Already Verified");

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function approvePatient(_x5, _x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var approveMedicalPractitioner = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, _ref5, info) {
    var prisma = _ref5.prisma,
        request = _ref5.request;
    var userData, databaseAdminHospital, medicalPractitioner, updatedUser;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userData = (0, _getUserData2.default)(request);

            if (!(!userData.verified && userData.role !== "DatabaseAdmin")) {
              _context3.next = 3;
              break;
            }

            throw new Error("Access Denied");

          case 3:
            _context3.next = 5;
            return prisma.query.databaseAdmins({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, "{ id hospital{ id } }");

          case 5:
            databaseAdminHospital = _context3.sent;
            _context3.next = 8;
            return prisma.query.medicalPractitioner({
              where: {
                mpId: args.data.id
              }
            }, "{ id user{ id verified } hospital {id} }");

          case 8:
            medicalPractitioner = _context3.sent;

            if (!(databaseAdminHospital[0].hospital.id === medicalPractitioner.hospital.id)) {
              _context3.next = 20;
              break;
            }

            if (!(medicalPractitioner.user.verified === false)) {
              _context3.next = 17;
              break;
            }

            _context3.next = 13;
            return prisma.mutation.updateUser({
              where: {
                id: medicalPractitioner.user.id
              },
              data: {
                verified: true
              }
            });

          case 13:
            updatedUser = _context3.sent;
            return _context3.abrupt("return", "Medical Practitioner Verified");

          case 17:
            throw new Error("Already Verified");

          case 18:
            _context3.next = 21;
            break;

          case 20:
            throw new Error("Invalid Request");

          case 21:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function approveMedicalPractitioner(_x9, _x10, _x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var registerDatabaseAdmin = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, args, _ref7, info) {
    var prisma = _ref7.prisma,
        request = _ref7.request;
    var result, emailTaken, hashedPassword, daUser, daCountry, daHospital, databaseAdmin;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return registerDatabaseAdminSchema.validate({
              firstName: args.data.firstName,
              middleName: args.data.middleName,
              lastName: args.data.lastName,
              dob: args.data.dob,
              sex: args.data.sex,
              address: args.data.address,
              contact: args.data.contact,
              country: args.data.country,
              email: args.data.email.toLowerCase(),
              password: args.data.password,
              hospital: args.data.hospital
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
            return prisma.mutation.createUser({
              data: {
                firstName: (0, _misc.capitalizeFirstLetter)(args.data.firstName),
                middleName: (0, _misc.capitalizeFirstLetter)(args.data.middleName),
                lastName: (0, _misc.capitalizeFirstLetter)(args.data.lastName),
                searchName: args.data.firstName.toLowerCase() + "-" + args.data.middleName.toLowerCase() + "-" + args.data.lastName.toLowerCase(),
                dob: args.data.dob,
                sex: args.data.sex,
                email: args.data.email.toLowerCase(),
                role: "DatabaseAdmin",
                isAdmin: true,
                password: hashedPassword,
                verified: false
              }
            });

          case 17:
            daUser = _context4.sent;
            _context4.next = 20;
            return prisma.query.country({
              where: {
                countryCode: parseInt(args.data.country, 10)
              }
            }, "{ countryCode }");

          case 20:
            daCountry = _context4.sent;
            _context4.next = 23;
            return prisma.query.hospital({
              where: {
                hospitalId: args.data.hospital
              }
            }, "{ hospitalId }");

          case 23:
            daHospital = _context4.sent;

            if (!(daCountry && daHospital)) {
              _context4.next = 31;
              break;
            }

            _context4.next = 27;
            return prisma.mutation.createDatabaseAdmin({
              data: {
                address: args.data.address,
                contact: args.data.contact,
                user: {
                  connect: {
                    id: daUser.id
                  }
                },
                country: {
                  connect: {
                    countryCode: daCountry.countryCode
                  }
                },
                hospital: {
                  connect: {
                    hospitalId: daHospital.hospitalId
                  }
                }
              }
            });

          case 27:
            databaseAdmin = _context4.sent;
            return _context4.abrupt("return", "Database Admin registered with id " + daUser.id + " and will be verified within 2-3 business days.");

          case 31:
            throw new Error("Invalid Data");

          case 32:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function registerDatabaseAdmin(_x13, _x14, _x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

var updateDatabaseAdmin = function () {
  var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, args, _ref9, info) {
    var prisma = _ref9.prisma,
        request = _ref9.request;
    var userData, result, databaseAdmin, updatedUser, updatedDatabaseAdmin;
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
            return updateDatabaseAdminSchema.validate({
              address: args.data.address,
              contact: args.data.contact,
              password: args.data.password
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
            return prisma.query.databaseAdmins({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, "{ id }");

          case 10:
            databaseAdmin = _context5.sent;

            if (!(databaseAdmin.length === 1)) {
              _context5.next = 26;
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
            _context5.next = 22;
            return prisma.mutation.updateDatabaseAdmin({
              where: {
                id: databaseAdmin[0].id
              },
              data: args.data
            });

          case 22:
            updatedDatabaseAdmin = _context5.sent;
            return _context5.abrupt("return", "Update Successful");

          case 26:
            throw new Error("Invalid Request");

          case 27:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));

  return function updateDatabaseAdmin(_x17, _x18, _x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _joi = require("joi");

var _joi2 = _interopRequireDefault(_joi);

var _hashPassword = require("../../utils/hashPassword");

var _hashPassword2 = _interopRequireDefault(_hashPassword);

var _getUserData = require("../../utils/getUserData");

var _getUserData2 = _interopRequireDefault(_getUserData);

var _misc = require("../../utils/misc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var registerDatabaseAdminSchema = _joi2.default.object().keys({
  firstName: _joi2.default.string().required(),
  middleName: _joi2.default.string().required(),
  lastName: _joi2.default.string().required(),
  dob: _joi2.default.string().regex(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/).required(),
  sex: _joi2.default.string().valid("Male", "Female", "Transgender"),
  address: _joi2.default.string().required(),
  country: _joi2.default.string().required(),
  hospital: _joi2.default.string().required().length(9),
  contact: _joi2.default.string().regex(/^[+]\d{2,4}-\d{3}\d{3}\d{4}$/).required(),
  email: _joi2.default.string().lowercase().email().required(),
  password: _joi2.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8).required()
});
var updateDatabaseAdminSchema = _joi2.default.object().keys({
  password: _joi2.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8),
  contact: _joi2.default.string(),
  address: _joi2.default.string()
});

exports.meDatabaseAdmin = meDatabaseAdmin;
exports.registerDatabaseAdmin = registerDatabaseAdmin;
exports.updateDatabaseAdmin = updateDatabaseAdmin;
exports.approveMedicalPractitioner = approveMedicalPractitioner;
exports.approvePatient = approvePatient;