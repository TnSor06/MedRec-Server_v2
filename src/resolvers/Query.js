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

import { getCountry, getRegion }
    from './userCRUD/CountryRegion'

import { getHospital }
    from './userCRUD/Hospital'

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
    getCountry,
    getRegion,
    getHospital
}

export default Query