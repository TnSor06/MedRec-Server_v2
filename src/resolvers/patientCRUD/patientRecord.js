import Joi from 'joi'

import getUserData from '../../utils/getUserData'
import {
    pad
} from '../../utils/misc';

const createPatientRecordSchema = Joi.object().keys({
    case: Joi.string().required(),
    onArrival: Joi.string().required(),
    diagnosis: Joi.string().required(),
    Tx: Joi.string().required(),
    reportSuggestions: Joi.string(),
    cevsSp: Joi.number().integer().required(),
    cevsDp: Joi.number().integer().required(),
    cePr: Joi.number().integer().required(),
    ceRr: Joi.number().integer().required(),
    ceHeight: Joi.number().integer().required(),
    ceWeight: Joi.number().integer().required(),
    diagnosisAfterReport: Joi.string(),
    medication: Joi.string().required(),
    advice: Joi.string().required(),
    query: Joi.string().required(),
    followUpObservations: Joi.string().required()
})

async function createPatientRecord(parent, args, {
    prisma,
    request
}, info) {
    const result = await Joi.validate({
        case: args.data.case,
        onArrival: args.data.onArrival,
        diagnosis: args.data.diagnosis,
        Tx: args.data.Tx,
        reportSuggestions: args.data.reportSuggestions,
        cevsSp: args.data.cevsSp,
        cevsDp: args.data.cevsDp,
        cePr: args.data.cePr,
        ceRr: args.data.ceRr,
        ceHeight: args.data.ceHeight,
        ceWeight: args.data.ceWeight,
        diagnosisAfterReport: args.data.diagnosisAfterReport,
        medication: args.data.medication,
        advice: args.data.advice,
        query: args.data.query,
        followUpObservations: args.data.followUpObservations
    }, createPatientRecordSchema);
    if (result.error) {
        throw new Error("Invalid Data")
    }
    const user = getUserData(request)

    if (!(user.verified && (user.role === "MedicalPractitioner"))) {
        throw new Error("Access Denied")
    }

    // get Patient
    const medicalPractitioner = await prisma.query.medicalPractitioners({
        where: {
            user: {
                id: user.id
            }
        }
    }, `{ mpId }`)
    const patientCase = await prisma.query.patientCase({
        where: {
            caseId: args.data.case
        }
    }, `{ caseId noOfVisits medicalPractitioner { mpId } patient { patientId user{ verified } } }`)

    if (!patientCase.patient.user.verified) {
        throw new Error(" Patient Not Verified")
    }

    if (!patientCase) {
        throw new Error("Invalid Patient")
    }
    // Only medicalPractitioner created the case has access to each record
    if (patientCase.medicalPractitioner.mpId !== medicalPractitioner[0].mpId) {
        throw new Error("Access Denied")
    }
    // Previous Record Id
    const prevPatientRecords = await prisma.query.patientRecords({
        where: {
            patient: {
                patientId: patientCase.patient.patientId
            }
        },
        orderBy: 'recordId_DESC'
    }, `{ recordId }`)
    var recordId = ''
    if (prevPatientRecords.length === 0) {
        recordId = `${patientCase.caseId}0001`
    } else {
        let recordNum = prevPatientRecords[0].recordId.substr(patientCase.caseId.length)
        recordNum = parseInt(recordNum, 10) + 1
        recordId = `${patientCase.caseId}${pad(recordNum,4)}`
    }

    const visitNo = parseInt(prevPatientRecords.length, 10) + 1
    const noOfVisits = parseInt(patientCase.noOfVisits, 10) + 1
    // increment patient case
    const updatePatientCase = await prisma.mutation.updatePatientCase({
        where: {
            caseId: patientCase.caseId
        },
        data: {
            noOfVisits: noOfVisits
        }
    }, `{ caseId noOfVisits}`)
    const patientRecord = await prisma.mutation.createPatientRecord({
        data: {
            recordId: recordId,
            visitNo: visitNo,
            onArrival: args.data.onArrival,
            diagnosis: args.data.diagnosis,
            Tx: args.data.Tx,
            reportSuggestions: args.data.reportSuggestions,
            cevsSp: args.data.cevsSp,
            cevsDp: args.data.cevsDp,
            cePr: args.data.cePr,
            ceRr: args.data.ceRr,
            ceHeight: args.data.ceHeight,
            ceWeight: args.data.ceWeight,
            diagnosisAfterReport: args.data.diagnosisAfterReport,
            medication: args.data.medication,
            advice: args.data.advice,
            query: args.data.query,
            followUpObservations: args.data.followUpObservations,
            patient: {
                connect: {
                    patientId: patientCase.patient.patientId
                }
            },
            case: {
                connect: {
                    caseId: patientCase.caseId
                }
            }
        }
    }, info)
    return patientRecord
}

export {
    createPatientRecord
}