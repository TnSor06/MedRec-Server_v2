'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _iCDCode = require('./icdCRUD/iCDCode');

var _iCDSubCode = require('./icdCRUD/iCDSubCode');

var _me = require('./userCRUD/me');

var _medicalPractitioner = require('./userCRUD/medicalPractitioner');

var _patient = require('./userCRUD/patient');

var _databaseAdmin = require('./userCRUD/databaseAdmin');

var _user = require('./userCRUD/user');

var _CountryRegion = require('./userCRUD/CountryRegion');

var _Hospital = require('./userCRUD/Hospital');

var _patientCase = require('./patientCRUD/patientCase');

var _patientRecord = require('./patientCRUD/patientRecord');

var _sharedCase = require('./patientCRUD/sharedCase');

var _sharedRecord = require('./patientCRUD/sharedRecord');

var Query = {
    me: _me.me,
    meMedicalPractitioner: _medicalPractitioner.meMedicalPractitioner,
    mePatient: _patient.mePatient,
    meDatabaseAdmin: _databaseAdmin.meDatabaseAdmin,
    viewPatient: _patient.viewPatient,
    viewMedicalPractitioner: _medicalPractitioner.viewMedicalPractitioner,
    searchUser: _user.searchUser,
    icdcodes: _iCDCode.icdcodes,
    icdsubcodes: _iCDSubCode.icdsubcodes,
    getCountry: _CountryRegion.getCountry,
    getRegion: _CountryRegion.getRegion,
    getHospital: _Hospital.getHospital,
    viewPatientCase: _patientCase.viewPatientCase,
    viewPatientRecord: _patientRecord.viewPatientRecord,
    viewSharedCase: _sharedCase.viewSharedCase,
    viewSharedRecord: _sharedRecord.viewSharedRecord
};

exports.default = Query;