import bcrypt from 'bcrypt'
import Joi from 'joi'

import hashPassword from '../../utils/hashPassword'
import getUserData from '../../utils/getUserData';

const registerPatientSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    middleName: Joi.string().required(),
    lastName: Joi.string().required(),
    dob: Joi.string().regex(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/).required(),
    sex: Joi.string().valid('Male', 'Female', 'Transgender').required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8).required(),
    bloodGroup: Joi.string().required(),
    religion: Joi.string().required(),
    maritalStatus: Joi.string().required().valid('Single', 'Married', 'Divorced', 'Widowed'),
    primaryLanguage: Joi.string().required(),
    birthPlace: Joi.string().required(),
    address: Joi.string().required(),
    pincode: Joi.string().required(),
    country: Joi.string().required(),
    occupation: Joi.string().required(),
    contact1: Joi.string().regex(/^[+]\d{2,4}-\d{3}\d{3}\d{4}$/).required(),
    contact2: Joi.string().regex(/^[+]\d{2,4}-\d{3}\d{3}\d{4}$/).required(),
    socioEcoStatus: Joi.string().required(),
    immunizationHistory: Joi.string().required(),
    allergyStatus: Joi.boolean(),
    organDonorStatus: Joi.boolean(),
    PMH: Joi.string().required(),
    DHx: Joi.string().required(),
    Ca: Joi.boolean(),
    IDDM: Joi.boolean(),
    NIDDM: Joi.boolean(),
    COPD: Joi.boolean(),
    MI: Joi.boolean(),
    AF: Joi.boolean()
})

async function mePatient(parent, args, {
    prisma,
    request
}, info) {
    const userData = getUserData(request)

    if (!(userData.verified)) {
        throw new Error("Access Denied")
    }
    const patient = await prisma.query.patients({
        where: {
            user: {
                id: userData.id
            }
        }
    }, info)
    if (patient.length === 1) {
        return patient[0]
    } else {
        throw new Error("Invalid Request")
    }
}

async function registerPatient(parent, args, {
    prisma,
    request
}, info) {
    const result = await Joi.validate({
        firstName: args.data.firstName,
        middleName: args.data.middleName,
        lastName: args.data.lastName,
        dob: args.data.dob,
        sex: args.data.sex,
        email: args.data.email,
        password: args.data.password,
        address: args.data.address,
        bloodGroup: args.data.bloodGroup,
        religion: args.data.religion,
        maritalStatus: args.data.maritalStatus,
        primaryLanguage: args.data.primaryLanguage,
        birthPlace: args.data.birthPlace,
        pincode: args.data.pincode,
        country: args.data.country,
        occupation: args.data.occupation,
        contact1: args.data.contact1,
        contact2: args.data.contact2,
        socioEcoStatus: args.data.socioEcoStatus,
        immunizationHistory: args.data.immunizationHistory,
        allergyStatus: args.data.allergyStatus,
        organDonorStatus: args.data.organDonorStatus,
        PMH: args.data.PMH,
        DHx: args.data.DHx,
        Ca: args.data.Ca,
        IDDM: args.data.IDDM,
        NIDDM: args.data.NIDDM,
        COPD: args.data.COPD,
        MI: args.data.MI,
        AF: args.data.AF,
    }, registerPatientSchema);
    if (result.error) {
        throw new Error("Invalid Data")
    }
    const emailTaken = await prisma.exists.User({
        email: args.data.email
    })
    if (emailTaken) {
        throw new Error('Invalid User')
    } else {
        const hashedPassword = await hashPassword(args.data.password)
        const patUser = await prisma.mutation.createUser({
            data: {
                firstName: args.data.firstName,
                middleName: args.data.middleName,
                lastName: args.data.lastName,
                dob: args.data.dob,
                sex: args.data.sex,
                email: args.data.email,
                role: "Patient",
                isAdmin: false,
                password: hashedPassword,
                verified: false
            }
        })
        const patCountry = await prisma.query.country({
            where: {
                countryCode: parseInt(args.data.country, 10)
            }
        }, `{ countryCode }`)
        const patRegion = await prisma.query.region({
            where: {
                pincode: parseInt(args.data.pincode, 10)
            }
        }, `{ pincode }`)
        const prevPatient = await prisma.query.patients({
            where: {
                patientId_starts_with: `${patCountry.countryCode}${patRegion.pincode}`
            },
            orderBy: 'patientId_DESC'
        }, `{ patientId }`)
        var patientId = ''
        if (prevPatient.length === 0) {
            patientId = `${patCountry.countryCode}${patRegion.pincode}0000000001`
        } else {
            patientId = parseInt(prevPatient[0].patientId, 10) + 1
            patientId = patientId.toString()
        }
        const patient = await prisma.mutation.createPatient({
            data: {
                patientId: patientId,
                address: args.data.address,
                bloodGroup: args.data.bloodGroup,
                religion: args.data.religion,
                maritalStatus: args.data.maritalStatus,
                primaryLanguage: args.data.primaryLanguage,
                birthPlace: args.data.birthPlace,
                occupation: args.data.occupation,
                contact1: args.data.contact1,
                contact2: args.data.contact2,
                socioEcoStatus: args.data.socioEcoStatus,
                immunizationHistory: args.data.immunizationHistory,
                allergyStatus: args.data.allergyStatus,
                organDonorStatus: args.data.organDonorStatus,
                PMH: args.data.PMH,
                DHx: args.data.DHx,
                Ca: args.data.Ca,
                IDDM: args.data.IDDM,
                NIDDM: args.data.NIDDM,
                COPD: args.data.COPD,
                MI: args.data.MI,
                AF: args.data.AF,
                user: {
                    connect: {
                        id: patUser.id
                    }
                },
                pincode: {
                    connect: {
                        pincode: patRegion.pincode
                    }
                },
                country: {
                    connect: {
                        countryCode: patCountry.countryCode
                    }
                },
            }
        })
        return "Patient registered and will be verified within 2-3 business days."
    }
}

export {
    mePatient,
    registerPatient
}