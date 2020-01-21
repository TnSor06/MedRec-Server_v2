import Joi from 'joi'

import getUserData from '../../utils/getUserData'

import {
    pad
} from '../../utils/misc';

const addInsuranceSchema = Joi.object().keys({
    insuranceStatus: Joi.string().required(),
    insuranceCompany1: Joi.string().required(),
    insuranceCompany2: Joi.string().required(),
    sponsorerDetails: Joi.string().required()
})
const updateInsuranceSchema = Joi.object().keys({
    insuranceStatus: Joi.string(),
    insuranceCompany1: Joi.string(),
    insuranceCompany2: Joi.string(),
    sponsorerDetails: Joi.string()
})

async function addInsurance(parent, args, {
    prisma,
    request
}, info) {
    const result = await Joi.validate({
        insuranceStatus: args.data.insuranceStatus,
        insuranceCompany1: args.data.insuranceCompany1,
        insuranceCompany2: args.data.insuranceCompany2,
        sponsorerDetails: args.data.sponsorerDetails
    }, addInsuranceSchema);
    if (result.error) {
        throw new Error("Invalid Data")
    }
    const user = getUserData(request)

    if (!(user.verified && (user.role === "Patient"))) {
        throw new Error("Access Denied")
    }

    const patient = await prisma.query.patients({
        where: {
            user: {
                id: user.id
            }
        }
    }, `{id patientId}`)
    if (patient.length > 0) {
        const patInsurance = await prisma.mutation.createInsurance({
            data: {
                insuranceId: `${patient[0].patientId}`,
                insuranceStatus: args.data.insuranceStatus,
                insuranceCompany1: args.data.insuranceCompany1,
                insuranceCompany2: args.data.insuranceCompany2,
                sponsorerDetails: args.data.sponsorerDetails,
                patient: {
                    connect: {
                        patientId: patient[0].patientId
                    }
                }
            }
        }, info)
        return patInsurance
    } else {
        throw new Error("Invalid Request")
    }
}

async function updateInsurance(parent, args, {
    prisma,
    request
}, info) {
    const result = await Joi.validate({
        insuranceStatus: args.data.insuranceStatus,
        insuranceCompany1: args.data.insuranceCompany1,
        insuranceCompany2: args.data.insuranceCompany2,
        sponsorerDetails: args.data.sponsorerDetails
    }, updateInsuranceSchema);
    if (result.error) {
        throw new Error("Invalid Data")
    }
    const user = getUserData(request)

    if (!(user.verified && (user.role === "Patient"))) {
        throw new Error("Access Denied")
    }

    const patient = await prisma.query.patients({
        where: {
            user: {
                id: user.id
            }
        }
    }, `{id patientId}`)
    if (patient.length > 0) {
        const patInsurance = await prisma.mutation.updateInsurance({
            data: { ...args.data },
            where: {
                insuranceId: patient[0].patientId
            }
        }, info)
        return patInsurance
    } else {
        throw new Error("Invalid Request")
    }
}

export {
    addInsurance,
    updateInsurance
}