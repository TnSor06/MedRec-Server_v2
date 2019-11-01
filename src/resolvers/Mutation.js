import {
    login
} from './userCRUD/login'

import {
    registerMedicalPractitioner
} from './userCRUD/medicalPractioner'

import {
    registerPatient
} from './userCRUD/patient'

import {
    createPatientCase
} from './patientCRUD/patientCase'

import {
    createPatientRecord
} from './patientCRUD/patientRecord'

const Mutation = {
    login,
    registerMedicalPractitioner,
    registerPatient,
    createPatientCase,
    createPatientRecord

}

export default Mutation