import {
    icdcodes
} from './icdCRUD/iCDCode'

import {
    icdsubcodes
} from './icdCRUD/iCDSubCode'

import {
    me
} from './userCRUD/me'

import {
    meMedicalPractitioner
} from './userCRUD/medicalPractioner'

import {
    mePatient
} from './userCRUD/patient'


const Query = {
    me,
    meMedicalPractitioner,
    mePatient,
    icdcodes,
    icdsubcodes
}

export default Query