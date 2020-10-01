"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genHL7 = undefined;

var _pythonShell = require("python-shell");

var genHL7 = function genHL7(jsonData, type) {
  var options = {
    args: [jsonData, type]
  };
  var python_file = __dirname + "/hl7_gen.py";
  return new Promise(function (resolve, reject) {
    _pythonShell.PythonShell.run(python_file, options, function (err, results) {
      if (err) {
        console.log(err);
        reject(Error("Error in generating HL7"));
      } else {
        resolve(results.join("\n"));
      }
    });
  });
};

exports.genHL7 = genHL7;