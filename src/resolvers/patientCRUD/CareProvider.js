import Joi from 'joi'

import getUserData from '../../utils/getUserData'

import {
    pad
} from '../../utils/misc';

const addCareProviderSchema = Joi.object().keys({
    cpaddress: Joi.string().required(),
    city: Joi.string().required(),
    pincode: Joi.string().required(),
    country: Joi.string().required(),
    contact: Joi.string().required(),
    email: Joi.string().lowercase().email().required()
})
const updateCareProviderSchema = Joi.object().keys({
    cpaddress: Joi.string(),
    city: Joi.string(),
    pincode: Joi.string(),
    country: Joi.string(),
    contact: Joi.string(),
    email: Joi.string().lowercase().email()
})

async function addCareProvider(parent, args, {
    prisma,
    request
}, info) {
    const result = await Joi.validate({
        cpaddress: args.data.cpaddress,
        city: args.data.city,
        pincode: args.data.pincode,
        country: args.data.country,
        contact: args.data.contact,
        email: args.data.email
    }, addCareProviderSchema);
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
        const patCareProvider = await prisma.mutation.createCareProvider({
            data: {
                cpId: `${patient[0].patientId}`,
                cpaddress: args.data.cpaddress,
                city: args.data.city,
                contact: args.data.contact,
                email: args.data.email,
                patient: {
                    connect: {
                        patientId: patient[0].patientId
                    }
                },
                pincode: {
                    connect: {
                        pincode: parseInt(args.data.pincode, 10)
                    }
                },
                country: {
                    connect: {
                        countryCode: parseInt(args.data.country, 10)
                    }
                }
            }
        }, info)
        return patCareProvider
    } else {
        throw new Error("Invalid Request")
    }
}

async function updateCareProvider(parent, args, {
    prisma,
    request
}, info) {
    const result = await Joi.validate({
        cpaddress: args.data.cpaddress,
        city: args.data.city,
        pincode: args.data.pincode,
        country: args.data.country,
        contact: args.data.contact,
        email: args.data.email
    }, updateCareProviderSchema);
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
        const data = { ...args.data }

        if (typeof args.data.country === 'string') {
            const patCountry = await prisma.query.country({
                where: {
                    countryCode: parseInt(args.data.country, 10)
                }
            }, `{ countryCode }`)
            data["country"] = {
                connect: {
                    countryCode: patCountry.countryCode
                }
            }
        }
        if (typeof args.data.pincode === 'string') {
            const patRegion = await prisma.query.region({
                where: {
                    pincode: parseInt(args.data.pincode, 10)
                }
            }, `{ pincode }`)

            data.pincode = {
                connect: {
                    pincode: patRegion.pincode
                }
            }
        }
        const patCareProvider = await prisma.mutation.updateCareProvider({
            data: data,
            where: {
                cpId: patient[0].patientId
            }
        }, info)
        return patCareProvider
    } else {
        throw new Error("Invalid Request")
    }
}

export {
    addCareProvider,
    updateCareProvider
}