import Joi from "joi";

import getUserData from "../../utils/getUserData";
import { genHL7 } from "../../utils/HL7_caller";

const createSharedRecordSchema = Joi.object().keys({
  record: Joi.string().required(),
  receiver: Joi.string().required(),
});

async function createSharedRecord(parent, args, { prisma, request }, info) {
  const result = await createSharedRecordSchema.validate({
    record: args.data.record,
    receiver: args.data.receiver,
  });
  if (result.error) {
    throw new Error("Invalid Data");
  }
  const user = getUserData(request);

  if (!(user.verified && user.role === "MedicalPractitioner")) {
    throw new Error("Access Denied");
  }

  // sender MedicalPractitioner
  let medicalPractitioner = await prisma.query.medicalPractitioners(
    {
      where: {
        user: {
          id: user.id,
        },
      },
    },
    `{ mpId }`
  );

  if (medicalPractitioner.length === 1) {
    medicalPractitioner = medicalPractitioner[0];
  } else {
    throw new Error("Invalid Request");
  }

  // Case Id
  const patientRecord = await prisma.query.patientRecord(
    {
      where: {
        recordId: args.data.record,
      },
    },
    `{
    recordId
    medicalPractitioner{
      user{
        firstName
        middleName
        lastName
        sex
        dob
        email
      }
      mpId
      address
      clinicAddress
      degree
      field
      hospital{
        hospitalId
        name
        address
        district
        pincode{
          pincode
          region
        }
        country{
          countryCode
          countryName
        }
      }
    }
    visitNo
    onArrival
    diagnosis
    Tx
    reportSuggestions
    cevsSp
    cevsDp
    ceRr
    cePr
    ceWeight
    ceHeight
    diagnosisAfterReport
    medication
    advice
    query
    followUpObservations
    createdAt
    patient{
      user{
        firstName
        middleName
        lastName
        sex
        dob
        email
      }
      patientId
      bloodGroup
      principleLanguage
      motherName
      aadharNo
      religion
      maritalStatus
      primaryLanguage
      birthPlace
      address
      pincode{
          pincode
          region
        }
      country{
        countryCode
        countryName
      }
      occupation
      contact1
      contact2
      socioEcoStatus
      immunizationHistory
      allergyStatus
      organDonorStatus
      PMH
      DHx
      Ca
      IDDM
      NIDDM
      COPD
      MI
      AF
      cpId{
        id
        cpPatientId {
          patientId
          motherName
          aadharNo
          religion
          maritalStatus
          primaryLanguage
          address
          contact1
          contact2
          socioEcoStatus
          country{
            countryCode
            countryName
          }
          user {
            firstName
            middleName
            lastName
            sex
            dob
            email
            verified
          }
        }
        cpPatientRelation
      }
      insurance{
        insuranceId
        insuranceStatus
        insuranceCompany1
        insuranceCompany2
        sponsorerDetails
      }
    }
    case{
      caseId
      medicalPractitioner{
        user{
          firstName
          middleName
          lastName
          sex
          dob
          email
        }
        mpId
        address
        clinicAddress
        degree
        field
        hospital{
          hospitalId
          name
          address
          district
          pincode{
            pincode
            region
          }
          country{
            countryCode
            countryName
          }
        }
      }
      icdCode{
        icdCode
        commonName
      }
      icdSubCode{
        icdSubCode
        scientificName
      }
      HPC
      MoI
      DandV
      clinicalNote
      noOfVisits
      diagnosisType
      currentClinicalStatus
      createdAt
      updatedAt
    }
  }`
  );

  // Receiver MedicalPractitioner
  let receiverMedicalPractitioner = await prisma.query.medicalPractitioner(
    {
      where: {
        mpId: args.data.receiver,
      },
    },
    `{ mpId user { verified } }`
  );
  if (receiverMedicalPractitioner.user.verified === true) {
    if (receiverMedicalPractitioner.mpId === medicalPractitioner.mpId) {
      throw new Error("Invalid Request");
    }
  } else {
    throw new Error("Medical Practitioner Not Found");
  }

  // Check if sender has access
  const senderCheck = await prisma.query.sharedRecords(
    {
      where: {
        AND: [
          {
            record: {
              recordId: patientRecord.recordId,
            },
          },
          {
            receiver: {
              mpId: medicalPractitioner.mpId,
            },
          },
        ],
      },
    },
    `{ receiver {mpId} }`
  );

  // Shared by record owner or case owner
  if (
    patientRecord.medicalPractitioner.mpId !== medicalPractitioner.mpId &&
    patientRecord.case.medicalPractitioner.mpId !== medicalPractitioner.mpId
  ) {
    // Shared by those who have recieved the record
    if (senderCheck.length === 0) {
      throw new Error("Access Denied");
    }
  }

  // Check if receiver has already been shared or not
  if (
    patientRecord.medicalPractitioner.mpId === receiverMedicalPractitioner.mpId
  ) {
    throw new Error("Receiver is owner of Record");
  }
  if (
    patientRecord.case.medicalPractitioner.mpId ===
    receiverMedicalPractitioner.mpId
  ) {
    throw new Error("Receiver is owner of Case");
  }

  const receiverCheck = await prisma.query.sharedRecords(
    {
      where: {
        AND: [
          {
            record: {
              recordId: patientRecord.recordId,
            },
          },
          {
            receiver: {
              mpId: receiverMedicalPractitioner.mpId,
            },
          },
        ],
      },
    },
    `{ receiver {mpId} }`
  );

  if (receiverCheck.length > 0) {
    throw new Error("Already Shared");
  }

  // Get HL7 all details stored in "patientRecord" variable
  const HL7 = await genHL7(JSON.stringify(patientRecord), "record");

  const sharedRecord = await prisma.mutation.createSharedRecord(
    {
      data: {
        HL7: HL7,
        record: {
          connect: {
            recordId: patientRecord.recordId,
          },
        },
        case: {
          connect: {
            caseId: patientRecord.case.caseId,
          },
        },
        sender: {
          connect: {
            mpId: medicalPractitioner.mpId,
          },
        },
        receiver: {
          connect: {
            mpId: receiverMedicalPractitioner.mpId,
          },
        },
      },
    },
    info
  );
  return sharedRecord;
}
async function viewSharedRecord(parent, args, { prisma, request }, info) {
  const userData = getUserData(request);
  if (!userData.verified) {
    throw new Error("Access Denied");
  }
  const patientId = args.patientId;
  if (userData.role === "Patient") {
    const spread = {
      ...(args.recordId && { record: { recordId: args.recordId } }),
      ...(args.FromDate && { sharedAt_gte: args.FromDate }),
      ...(args.ToDate && { sharedAt_lte: args.ToDate }),
    };
    const where = {
      AND: [
        {
          case: {
            patient: {
              user: {
                id: userData.id,
              },
            },
          },
        },
        {
          case: {
            caseId: args.caseId,
          },
        },
        ...Object.keys(spread).map((k) => ({ [k]: spread[k] })),
      ],
    };
    const records = await prisma.query.sharedRecords(
      {
        where: where,
        orderBy: "sharedAt_DESC",
      },
      info
    );
    return records;
  }
  if (userData.role === "DatabaseAdmin") {
    const spread = {
      ...(args.recordId && { record: { recordId: args.recordId } }),
      ...(args.FromDate && { sharedAt_gte: args.FromDate }),
      ...(args.ToDate && { sharedAt_lte: args.ToDate }),
    };
    const where = {
      AND: [
        {
          case: {
            caseId: args.caseId,
          },
        },
        ...Object.keys(spread).map((k) => ({ [k]: spread[k] })),
      ],
    };
    const records = await prisma.query.sharedRecords(
      {
        where: where,
        orderBy: "sharedAt_DESC",
      },
      info
    );
    return records;
  }

  if (userData.role === "MedicalPractitioner") {
    const records = [];
    const mp = await prisma.query.medicalPractitioners(
      {
        where: {
          user: {
            id: userData.id,
          },
        },
      },
      `{mpId hospital {hospitalId}}`
    );
    const where = {
      ...(args.recordId && { record: { recordId: args.recordId } }),
      ...(args.FromDate && { sharedAt_gte: args.FromDate }),
      ...(args.ToDate && { sharedAt_lte: args.ToDate }),
    };
    const recordsOwn = await prisma.query.sharedRecords(
      {
        where: {
          AND: [
            {
              case: {
                medicalPractitioner: {
                  user: {
                    id: userData.id,
                  },
                },
              },
            },
            {
              case: {
                caseId: args.caseId,
              },
            },
            ...Object.keys(where).map((k) => ({ [k]: where[k] })),
          ],
        },
        orderBy: "sharedAt_DESC",
      },
      info
    );
    const recordsRecieve = await prisma.query.sharedRecords(
      {
        where: {
          AND: [
            {
              case: {
                medicalPractitioner: {
                  user: {
                    id_not: userData.id,
                  },
                },
              },
            },
            {
              case: {
                caseId: args.caseId,
              },
            },
            {
              receiver: {
                mpId: mp.mpId,
              },
            },
            ...Object.keys(where).map((k) => ({ [k]: where[k] })),
          ],
        },
        orderBy: "sharedAt_DESC",
      },
      info
    );
    records.push(...recordsOwn, ...recordsRecieve);
    return records;
  }
}

export { createSharedRecord, viewSharedRecord };
