import Joi from 'joi'

import getUserData from '../../utils/getUserData'

const createSharedRecordSchema = Joi.object().keys({
    record: Joi.string().required(),
    receiver: Joi.string().required()
})

async function createSharedRecord(parent, args, {
    prisma,
    request
}, info) {
    const result = await Joi.validate({
        record: args.data.record,
        receiver: args.data.receiver,
    }, createSharedRecordSchema);
    if (result.error) {
        throw new Error("Invalid Data")
    }
    const user = getUserData(request)

    if (!(user.verified && (user.role === "MedicalPractitioner"))) {
        throw new Error("Access Denied")
    }

    // sender MedicalPractitioner
    let medicalPractitioner = await prisma.query.medicalPractitioners({
        where: {
            user: {
                id: user.id
            }
        }
    }, `{ mpId }`)

    if (medicalPractitioner.length === 1) {
        medicalPractitioner = medicalPractitioner[0]
    } else {
        throw new Error("Invalid Request")
    }

    // Case Id
    const patientRecord = await prisma.query.patientRecord({
        where: {
            recordId: args.data.record
        }
    }, `{ recordId case { caseId medicalPractitioner {mpId} } medicalPractitioner { mpId} }`)

    // Receiver MedicalPractitioner
    let receiverMedicalPractitioner = await prisma.query.medicalPractitioner({
        where: {
            mpId: args.data.receiver
        }
    }, `{ mpId user { verified } }`)
    if (receiverMedicalPractitioner.user.verified === true) {
        if (receiverMedicalPractitioner.mpId === medicalPractitioner.mpId) {
            throw new Error("Invalid Request")
        }
    } else {
        throw new Error("Medical Practitioner Not Found")
    }

    // Check if sender has access
    const senderCheck = await prisma.query.sharedRecords({
        where: {
            AND: [
                {
                    record: {
                        recordId: patientRecord.recordId
                    }
                }, {
                    receiver: {
                        mpId: medicalPractitioner.mpId
                    }
                }
            ]
        }
    }, `{ receiver {mpId} }`)

    // Shared by record owner or case owner
    if (patientRecord.medicalPractitioner.mpId !== medicalPractitioner.mpId && patientRecord.case.medicalPractitioner.mpId !== medicalPractitioner.mpId) {
        // Shared by those who have recieved the record
        if (senderCheck.length === 0) {
            throw new Error("Access Denied")
        }
    }

    // Check if receiver has already been shared or not
    if (patientRecord.medicalPractitioner.mpId === receiverMedicalPractitioner.mpId) {
        throw new Error("Receiver is owner of Record")
    }
    if (patientRecord.case.medicalPractitioner.mpId === receiverMedicalPractitioner.mpId) {
        throw new Error("Receiver is owner of Case")
    }

    const receiverCheck = await prisma.query.sharedRecords({
        where: {
            AND: [
                {
                    record: {
                        recordId: patientRecord.recordId
                    }
                }, {
                    receiver: {
                        mpId: receiverMedicalPractitioner.mpId
                    }
                }
            ]
        }
    }, `{ receiver {mpId} }`)

    if (receiverCheck.length > 0) {
        throw new Error("Already Shared")
    }

    const sharedRecord = await prisma.mutation.createSharedRecord({
        data: {
            HL7: "Some data",
            record: {
                connect: {
                    recordId: patientRecord.recordId
                }
            },
            case: {
                connect: {
                    caseId: patientRecord.case.caseId
                }
            },
            sender: {
                connect: {
                    mpId: medicalPractitioner.mpId
                }
            },
            receiver: {
                connect: {
                    mpId: receiverMedicalPractitioner.mpId
                }
            }
        }
    }, info)
    return sharedRecord

}

export {
    createSharedRecord
}