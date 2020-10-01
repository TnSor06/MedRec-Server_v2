'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _login = require('./userCRUD/login');

var _medicalPractitioner = require('./userCRUD/medicalPractitioner');

var _patient = require('./userCRUD/patient');

var _databaseAdmin = require('./userCRUD/databaseAdmin');

var _patientCase = require('./patientCRUD/patientCase');

var _patientRecord = require('./patientCRUD/patientRecord');

var _sharedCase = require('./patientCRUD/sharedCase');

var _sharedRecord = require('./patientCRUD/sharedRecord');

var _Insurance = require('./patientCRUD/Insurance');

var _CareProvider = require('./patientCRUD/CareProvider');

var Mutation = {
    login: _login.login,
    registerMedicalPractitioner: _medicalPractitioner.registerMedicalPractitioner,
    registerPatient: _patient.registerPatient,
    registerDatabaseAdmin: _databaseAdmin.registerDatabaseAdmin,
    updateDatabaseAdmin: _databaseAdmin.updateDatabaseAdmin,
    updateMedicalPractitioner: _medicalPractitioner.updateMedicalPractitioner,
    updatePatient: _patient.updatePatient,
    approveMedicalPractitioner: _databaseAdmin.approveMedicalPractitioner,
    approvePatient: _databaseAdmin.approvePatient,
    createPatientCase: _patientCase.createPatientCase,
    createPatientRecord: _patientRecord.createPatientRecord,
    createSharedCase: _sharedCase.createSharedCase,
    createSharedRecord: _sharedRecord.createSharedRecord,
    addInsurance: _Insurance.addInsurance,
    updateInsurance: _Insurance.updateInsurance,
    addCareProvider: _CareProvider.addCareProvider,
    updateCareProvider: _CareProvider.updateCareProvider
};

exports.default = Mutation;