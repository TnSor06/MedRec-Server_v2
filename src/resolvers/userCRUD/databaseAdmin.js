import bcrypt from 'bcrypt'
import Joi from 'joi'

import hashPassword from '../../utils/hashPassword'
import getUserData from '../../utils/getUserData';

const registerDatabaseAdminSchema = Joi.object().keys({
    firstName: Joi.string().required(),
    middleName: Joi.string().required(),
    lastName: Joi.string().required(),
    dob: Joi.string().regex(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/).required(),
    sex: Joi.string().valid('Male', 'Female', 'Transgender'),
    address: Joi.string().required(),
    country: Joi.string().required(),
    contact: Joi.string().regex(/^[+]\d{2,4}-\d{3}\d{3}\d{4}$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/).min(8).required()
})

async function meDatabaseAdmin(parent, args, {
    prisma,
    request
}, info) {
    const userData = getUserData(request)

    if (!(userData.verified)) {
        throw new Error("Access Denied")
    }
    const databaseAdmin = await prisma.query.databaseAdmins({
        where: {
            user: {
                id: userData.id
            }
        }
    }, info)
    if (databaseAdmin.length === 1) {
        return databaseAdmin[0]
    } else {
        throw new Error("Invalid Request")
    }
}

async function registerDatabaseAdmin(parent, args, {
    prisma,
    request
}, info) {
    const result = await Joi.validate({
        firstName: args.data.firstName,
        middleName: args.data.middleName,
        lastName: args.data.lastName,
        dob: args.data.dob,
        sex: args.data.sex,
        address: args.data.address,
        contact: args.data.contact,
        country: args.data.country,
        email: args.data.email,
        password: args.data.password
    }, registerDatabaseAdminSchema);
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
        const daUser = await prisma.mutation.createUser({
            data: {
                firstName: args.data.firstName,
                middleName: args.data.middleName,
                lastName: args.data.lastName,
                dob: args.data.dob,
                sex: args.data.sex,
                email: args.data.email,
                role: "DatabaseAdmin",
                isAdmin: true,
                password: hashedPassword,
                verified: false
            }
        })
        const daCountry = await prisma.query.country({
            where: {
                countryCode: parseInt(args.data.country, 10)
            }
        }, `{ countryCode }`)
        const databaseAdmin = await prisma.mutation.createDatabaseAdmin({
            data: {
                address: args.data.address,
                contact: args.data.contact,
                user: {
                    connect: {
                        id: daUser.id
                    }
                }, country: {
                    connect: {
                        countryCode: daCountry.countryCode
                    }
                },
            }
        })
        return "Database Admin registered and will be verified within 2-3 business days."
    }
}

export {
    meDatabaseAdmin,
    registerDatabaseAdmin
}