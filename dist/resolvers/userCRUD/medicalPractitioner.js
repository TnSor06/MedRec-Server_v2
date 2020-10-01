"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MedicalPractitioner = exports.viewMedicalPractitioner = exports.updateMedicalPractitioner = exports.registerMedicalPractitioner = exports.meMedicalPractitioner = undefined;

var meMedicalPractitioner = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var prisma = _ref.prisma,
        request = _ref.request;
    var userData, medicalPractitioner;
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
            return prisma.query.medicalPractitioners({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, info);

          case 5:
            medicalPractitioner = _context.sent;

            if (!(medicalPractitioner.length === 1)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", medicalPractitioner[0]);

          case 10:
            throw new Error("Invalid Request");

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function meMedicalPractitioner(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

var viewMedicalPractitioner = function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, _ref3, info) {
    var prisma = _ref3.prisma,
        request = _ref3.request;
    var result, userData, medicalPractitioner;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return viewMedicalPractitionerSchema.validate({
              id: args.id
            });

          case 2:
            result = _context2.sent;

            if (!result.error) {
              _context2.next = 5;
              break;
            }

            throw new Error("Invalid Data");

          case 5:
            userData = (0, _getUserData2.default)(request);

            if (!(!userData.verified && userData.role === "Patient")) {
              _context2.next = 8;
              break;
            }

            throw new Error("Access Denied");

          case 8:
            medicalPractitioner = null;

            if (!(userData.verified && userData.role === "MedicalPractitioner")) {
              _context2.next = 19;
              break;
            }

            if (!(args.id.length === 12)) {
              _context2.next = 16;
              break;
            }

            _context2.next = 13;
            return prisma.query.medicalPractitioners({
              where: {
                AND: [{
                  mpId: args.id
                }, {
                  user: {
                    verified: true
                  }
                }]
              }
            }, info);

          case 13:
            medicalPractitioner = _context2.sent;
            _context2.next = 19;
            break;

          case 16:
            _context2.next = 18;
            return prisma.query.medicalPractitioners({
              where: {
                user: {
                  AND: [{
                    verified: true
                  }, {
                    id: args.id
                  }]
                }
              }
            }, info);

          case 18:
            medicalPractitioner = _context2.sent;

          case 19:
            if (!(userData.verified && userData.role === "DatabaseAdmin")) {
              _context2.next = 29;
              break;
            }

            if (!(args.id.length === 12)) {
              _context2.next = 26;
              break;
            }

            _context2.next = 23;
            return prisma.query.medicalPractitioners({
              where: {
                mpId: args.id
              }
            }, info);

          case 23:
            medicalPractitioner = _context2.sent;
            _context2.next = 29;
            break;

          case 26:
            _context2.next = 28;
            return prisma.query.medicalPractitioners({
              where: {
                user: {
                  id: args.id
                }
              }
            }, info);

          case 28:
            medicalPractitioner = _context2.sent;

          case 29:
            if (!(medicalPractitioner.length === 1)) {
              _context2.next = 33;
              break;
            }

            return _context2.abrupt("return", medicalPractitioner[0]);

          case 33:
            throw new Error("Invalid Request");

          case 34:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function viewMedicalPractitioner(_x5, _x6, _x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

var registerMedicalPractitioner = function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, _ref5, info) {
    var prisma = _ref5.prisma,
        request = _ref5.request;
    var result, emailTaken, hashedPassword, mpUser, mpHospital, prevMedicalPractitioner, mpId, medicalPractitioner;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return registerMedicalPractitionerSchema.validate({
              firstName: args.data.firstName,
              middleName: args.data.middleName,
              lastName: args.data.lastName,
              dob: args.data.dob,
              sex: args.data.sex,
              address: args.data.address,
              clinicAddress: args.data.clinicAddress,
              degree: args.data.degree,
              field: args.data.field,
              hospital: args.data.hospital,
              email: args.data.email.toLowerCase(),
              password: args.data.password
            });

          case 2:
            result = _context3.sent;

            if (!result.error) {
              _context3.next = 5;
              break;
            }

            throw new Error("Invalid Data");

          case 5:
            _context3.next = 7;
            return prisma.exists.User({
              email: args.data.email.toLowerCase()
            });

          case 7:
            emailTaken = _context3.sent;

            if (!emailTaken) {
              _context3.next = 12;
              break;
            }

            throw new Error("Invalid User");

          case 12:
            _context3.next = 14;
            return (0, _hashPassword2.default)(args.data.password);

          case 14:
            hashedPassword = _context3.sent;
            _context3.next = 17;
            return prisma.mutation.createUser({
              data: {
                firstName: (0, _misc.capitalizeFirstLetter)(args.data.firstName),
                middleName: (0, _misc.capitalizeFirstLetter)(args.data.middleName),
                lastName: (0, _misc.capitalizeFirstLetter)(args.data.lastName),
                searchName: args.data.firstName.toLowerCase() + "-" + args.data.middleName.toLowerCase() + "-" + args.data.lastName.toLowerCase(),
                dob: args.data.dob,
                sex: args.data.sex,
                email: args.data.email.toLowerCase(),
                role: "MedicalPractitioner",
                isAdmin: false,
                password: hashedPassword,
                verified: false
              }
            });

          case 17:
            mpUser = _context3.sent;
            _context3.next = 20;
            return prisma.query.hospital({
              where: {
                hospitalId: args.data.hospital
              }
            }, "{ hospitalId pincode { pincode } country{ countryCode } }");

          case 20:
            mpHospital = _context3.sent;
            _context3.next = 23;
            return prisma.query.medicalPractitioners({
              where: {
                mpId_starts_with: "" + mpHospital.country.countryCode + mpHospital.pincode.pincode
              },
              orderBy: "mpId_DESC"
            }, "{ mpId }");

          case 23:
            prevMedicalPractitioner = _context3.sent;
            mpId = "";

            if (prevMedicalPractitioner.length === 0) {
              mpId = "" + mpHospital.country.countryCode + mpHospital.pincode.pincode + "000001";
            } else {
              mpId = parseInt(prevMedicalPractitioner[0].mpId, 10) + 1;
              mpId = mpId.toString();
            }
            _context3.next = 28;
            return prisma.mutation.createMedicalPractitioner({
              data: {
                mpId: mpId,
                address: args.data.address,
                clinicAddress: args.data.clinicAddress,
                degree: args.data.degree,
                field: args.data.field,
                user: {
                  connect: {
                    id: mpUser.id
                  }
                },
                hospital: {
                  connect: {
                    hospitalId: mpHospital.hospitalId
                  }
                }
              }
            });

          case 28:
            medicalPractitioner = _context3.sent;
            return _context3.abrupt("return", "Medical Practitioner registered with id " + mpId + " and will be verified within 2-3 business days.");

          case 30:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function registerMedicalPractitioner(_x9, _x10, _x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();

var updateMedicalPractitioner = function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, args, _ref7, info) {
    var prisma = _ref7.prisma,
        request = _ref7.request;
    var userData, result, medicalPractitioner, updatedUser, updatedMedicalPractitioner;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userData = (0, _getUserData2.default)(request);

            if (userData.verified) {
              _context4.next = 3;
              break;
            }

            throw new Error("Access Denied");

          case 3:
            _context4.next = 5;
            return updateMedicalPractitionerSchema.validate({
              address: args.data.address,
              clinicAddress: args.data.contact,
              password: args.data.password
            });

          case 5:
            result = _context4.sent;

            if (!result.error) {
              _context4.next = 8;
              break;
            }

            throw new Error("Invalid Data");

          case 8:
            _context4.next = 10;
            return prisma.query.medicalPractitioners({
              where: {
                user: {
                  id: userData.id
                }
              }
            }, "{ id }");

          case 10:
            medicalPractitioner = _context4.sent;

            if (!(medicalPractitioner.length === 1)) {
              _context4.next = 26;
              break;
            }

            if (!(typeof args.data.password === "string")) {
              _context4.next = 20;
              break;
            }

            _context4.next = 15;
            return (0, _hashPassword2.default)(args.data.password);

          case 15:
            args.data.password = _context4.sent;
            _context4.next = 18;
            return prisma.mutation.updateUser({
              where: {
                id: userData.id
              },
              data: {
                password: args.data.password
              }
            });

          case 18:
            updatedUser = _context4.sent;

            delete args.data.password;

          case 20:
            _context4.next = 22;
            return prisma.mutation.updateMedicalPractitioner({
              where: {
                id: medicalPractitioner[0].id
              },
              data: args.data
            });

          case 22:
            updatedMedicalPractitioner = _context4.sent;
            return _context4.abrupt("return", "Update Successful");

          case 26:
            throw new Error("Invalid Request");

          case 27:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));

  return function updateMedicalPractitioner(_x13, _x14, _x15, _x16) {
    return _ref8.apply(this, arguments);
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

var MedicalPractitioner = {
  // user: {
  //     fragment: "fragment mpUserId on MedicalPractitioner{ user{ id } }",
  //     resolve(parent, args, {
  //         prisma,
  //         request
  //     }, info) {
  //         return parent.user
  //     }
  // }
};

var registerMedicalPractitionerSchema = _joi2.default.object().keys({
  firstName: _joi2.default.string().required(),
  middleName: _joi2.default.string().required(),
  lastName: _joi2.default.string().required(),
  dob: _joi2.default.string().regex(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/).required(),
  sex: _joi2.default.string().valid("Male", "Female", "Transgender"),
  address: _joi2.default.string().required(),
  clinicAddress: _joi2.default.string().required(),
  degree: _joi2.default.string().required(),
  field: _joi2.default.string().required(),
  hospital: _joi2.default.string().required().length(9),
  email: _joi2.default.string().lowercase().email().required(),
  password: _joi2.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8).required()
});
var updateMedicalPractitionerSchema = _joi2.default.object().keys({
  password: _joi2.default.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8),
  clinicAddress: _joi2.default.string(),
  address: _joi2.default.string()
});
var viewMedicalPractitionerSchema = _joi2.default.object().keys({
  id: _joi2.default.string().required()
});
exports.meMedicalPractitioner = meMedicalPractitioner;
exports.registerMedicalPractitioner = registerMedicalPractitioner;
exports.updateMedicalPractitioner = updateMedicalPractitioner;
exports.viewMedicalPractitioner = viewMedicalPractitioner;
exports.MedicalPractitioner = MedicalPractitioner;