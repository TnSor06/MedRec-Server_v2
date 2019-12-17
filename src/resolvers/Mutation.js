import {
    login
} from './userCRUD/login'

import {
    registerMedicalPractitioner
} from './userCRUD/medicalPractitioner'

import {
    registerPatient
} from './userCRUD/patient'

import { registerDatabaseAdmin }
    from './userCRUD/databaseAdmin'

import {
    createPatientCase
} from './patientCRUD/patientCase'

import {
    createPatientRecord
} from './patientCRUD/patientRecord'

import {
    createSharedCase
} from './patientCRUD/sharedCase'

import {
    createSharedRecord
} from './patientCRUD/sharedRecord'

const Mutation = {
    login,
    registerMedicalPractitioner,
    registerPatient,
    registerDatabaseAdmin,
    createPatientCase,
    createPatientRecord,
    createSharedCase,
    createSharedRecord
}

export default Mutation