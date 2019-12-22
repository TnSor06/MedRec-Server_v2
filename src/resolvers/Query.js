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
    meMedicalPractitioner, viewMedicalPractitioner
} from './userCRUD/medicalPractitioner'

import {
    mePatient, viewPatient
} from './userCRUD/patient'

import { meDatabaseAdmin }
    from './userCRUD/databaseAdmin'

import { searchUser }
    from './userCRUD/user'

const Query = {
    me,
    meMedicalPractitioner,
    mePatient,
    meDatabaseAdmin,
    viewPatient,
    viewMedicalPractitioner,
    searchUser,
    icdcodes,
    icdsubcodes,
}

export default Query