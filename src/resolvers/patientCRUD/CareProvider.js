import Joi from "joi";

import getUserData from "../../utils/getUserData";

import { pad } from "../../utils/misc";

const addCareProviderSchema = Joi.object().keys({
  cpPatientId: Joi.string().required(),
  cpPatientRelation: Joi.string().required(),
});
const updateCareProviderSchema = Joi.object().keys({
  cpPatientId: Joi.string(),
  cpPatientRelation: Joi.string(),
});

async function addCareProvider(parent, args, { prisma, request }, info) {
  const result = await addCareProviderSchema.validate({
    cpPatientId: args.data.cpPatientId,
    cpPatientRelation: args.data.cpPatientRelation,
  });
  if (result.error) {
    throw new Error("Invalid Data");
  }
  const user = getUserData(request);

  if (!(user.verified && user.role === "Patient")) {
    throw new Error("Access Denied");
  }

  const patient = await prisma.query.patients(
    {
      where: {
        user: {
          id: user.id,
        },
      },
    },
    `{id patientId}`
  );

  // Check if patient exists for CP
  const cpPatientDetail = await prisma.query.patients({
    where: {
      AND: [
        {
          patientId: args.data.cpPatientId,
        },
        {
          user: {
            verified: true,
          },
        },
      ],
    },
  });
  if (cpPatientDetail.length === 0) {
    throw new Error("No patient exists for care provider");
  }
  if (patient.length > 0) {
    const patCareProvider = await prisma.mutation.createCareProvider(
      {
        data: {
          cpPatientId: {
            connect: {
              patientId: args.data.cpPatientId,
            },
          },
          cpPatientRelation: args.data.cpPatientRelation,
          patient: {
            connect: {
              patientId: patient[0].patientId,
            },
          },
        },
      },
      info
    );
    return patCareProvider;
  } else {
    throw new Error("Invalid Request");
  }
}

async function updateCareProvider(parent, args, { prisma, request }, info) {
  const result = await updateCareProviderSchema.validate({
    cpPatientId: args.data.cpaddress,
    cpPatientRelation: args.data.cpPatientRelation,
  });
  if (result.error) {
    throw new Error("Invalid Data");
  }
  const user = getUserData(request);

  if (!(user.verified && user.role === "Patient")) {
    throw new Error("Access Denied");
  }

  const patient = await prisma.query.patients(
    {
      where: {
        user: {
          id: user.id,
        },
      },
    },
    `{id patientId cpId{ id }}`
  );

  if (patient.length > 0) {
    const data = { ...args.data };

    if (typeof args.data.cpPatientId === "string") {
      // Check if patient exists for CP
      const cpPatientDetail = await prisma.query.patients({
        where: {
          AND: [
            {
              patientId: args.data.cpPatientId,
            },
            {
              user: {
                verified: true,
              },
            },
          ],
        },
      });
      if (cpPatientDetail.length === 0) {
        throw new Error("No patient exists for care provider");
      }
      data.cpPatientId = {
        connect: {
          patientId: args.data.cpPatientId,
        },
      };
    }
    const patCareProvider = await prisma.mutation.updateCareProvider(
      {
        data: data,
        where: {
          id: patient[0].cpId.id,
        },
      },
      info
    );
    return patCareProvider;
  } else {
    throw new Error("Invalid Request");
  }
}

export { addCareProvider, updateCareProvider };
