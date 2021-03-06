import Joi from "joi";

import getUserData from "../../utils/getUserData";
import { genHL7 } from "../../utils/HL7_caller";

const createSharedCaseSchema = Joi.object().keys({
  case: Joi.string().required(),
  receiver: Joi.string().required(),
});

async function createSharedCase(parent, args, { prisma, request }, info) {
  const result = await createSharedCaseSchema.validate({
    case: args.data.case,
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
  // Receiver MedicalPractitioner
  let receiverMedicalPractitioner = await prisma.query.medicalPractitioner(
    {
      where: {
        mpId: args.data.receiver,
      },
    },
    `{ mpId user { verified } }`
  );

  if (!receiverMedicalPractitioner) {
    throw new Error("Medical Practitioner Not Found");
  } else {
    if (receiverMedicalPractitioner.user.verified === true) {
      if (receiverMedicalPractitioner.mpId === medicalPractitioner.mpId) {
        throw new Error("Invalid Request");
      }
    }
  }

  // Case Id
  const patientCase = await prisma.query.patientCase(
    {
      where: {
        caseId: args.data.case,
      },
    },
    `{
    caseId
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
    patientRecord{
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
    }
  }`
  );
  // Get HL7 all details stored in "patientCase" variable
  const HL7 = await genHL7(JSON.stringify(patientCase), "case");

  // Check if sender has access
  const senderCheck = await prisma.query.sharedCases(
    {
      where: {
        AND: [
          {
            case: {
              caseId: patientCase.caseId,
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

  if (patientCase.medicalPractitioner.mpId !== medicalPractitioner.mpId) {
    if (senderCheck.length === 0) {
      throw new Error("Access Denied");
    }
  }

  // Check if receiver has already been shared or not
  if (
    patientCase.medicalPractitioner.mpId === receiverMedicalPractitioner.mpId
  ) {
    throw new Error("Receiver is owner of Case");
  }
  const receiverCheck = await prisma.query.sharedCases(
    {
      where: {
        AND: [
          {
            case: {
              caseId: patientCase.caseId,
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

  const sharedCase = await prisma.mutation.createSharedCase(
    {
      data: {
        HL7: HL7,
        case: {
          connect: {
            caseId: patientCase.caseId,
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
  return sharedCase;
}

async function viewSharedCase(parent, args, { prisma, request }, info) {
  const userData = getUserData(request);
  if (!userData.verified) {
    throw new Error("Access Denied");
  }
  const patientId = args.patientId;
  if (userData.role === "Patient") {
    const spread = {
      ...(args.caseId && { case: { caseId: args.caseId } }),
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
        ...Object.keys(spread).map((k) => ({ [k]: spread[k] })),
      ],
    };
    const cases = await prisma.query.sharedCases(
      {
        where: where,
        orderBy: "sharedAt_DESC",
      },
      info
    );
    return cases;
  }
  if (userData.role === "DatabaseAdmin") {
    let patient = {};
    if (args.patientId.length !== 25) {
      patient = {
        patientId,
      };
    } else {
      patient = {
        id: patientId,
      };
    }
    const spread = {
      ...(args.caseId && { case: { caseId: args.caseId } }),
      ...(args.FromDate && { sharedAt_gte: args.FromDate }),
      ...(args.ToDate && { sharedAt_lte: args.ToDate }),
    };
    const where = {
      AND: [
        {
          case: {
            patient: patient,
          },
        },
        ...Object.keys(spread).map((k) => ({ [k]: spread[k] })),
      ],
    };
    const cases = await prisma.query.sharedCases(
      {
        where: where,
        orderBy: "sharedAt_DESC",
      },
      info
    );
    return cases;
  }

  if (userData.role === "MedicalPractitioner") {
    const cases = [];
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
    let patient = {};
    if (args.patientId.length !== 25) {
      patient = {
        patientId,
      };
    } else {
      patient = {
        id: patientId,
      };
    }
    const where = {
      ...(args.caseId && { case: { caseId: args.caseId } }),
      ...(args.FromDate && { sharedAt_gte: args.FromDate }),
      ...(args.ToDate && { sharedAt_lte: args.ToDate }),
    };
    const caseOwn = await prisma.query.sharedCases(
      {
        where: {
          AND: [
            {
              case: {
                patient: patient,
              },
            },
            {
              case: {
                medicalPractitioner: {
                  user: {
                    id: userData.id,
                  },
                },
              },
            },
            ...Object.keys(where).map((k) => ({ [k]: where[k] })),
          ],
        },
        orderBy: "sharedAt_DESC",
      },
      info
    );
    const caseRecieve = await prisma.query.sharedCases(
      {
        where: {
          AND: [
            {
              case: {
                patient: patient,
              },
            },
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
    cases.push(...caseOwn, ...caseRecieve);
    return cases;
  }
}

export { createSharedCase, viewSharedCase };
