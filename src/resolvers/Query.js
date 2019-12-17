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
} from './userCRUD/medicalPractitioner'

import {
    mePatient
} from './userCRUD/patient'

import { meDatabaseAdmin }
    from './userCRUD/databaseAdmin'

const Query = {
    me,
    meMedicalPractitioner,
    mePatient,
    meDatabaseAdmin,
    icdcodes,
    icdsubcodes
}

export default Query