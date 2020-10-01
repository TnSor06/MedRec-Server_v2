"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var icdcodes = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(parent, args, _ref, info) {
    var request = _ref.request,
        prisma = _ref.prisma;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", prisma.query.iCDCodes({
              where: {
                searchCommonName_contains: args.commonName.toLowerCase().replace(" ", "-")
              },
              orderBy: "icdCode_ASC",
              first: 15
            }, info));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function icdcodes(_x, _x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.icdcodes = icdcodes;