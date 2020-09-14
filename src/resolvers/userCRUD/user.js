import Joi from "joi";
import getUserData from "../../utils/getUserData";
import { capitalizeFirstLetter } from "../../utils/misc";

const User = {
  password: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma, request }, info) {
      return "abcdefgh";
    },
  },
};

const searchUserSchema = Joi.object().keys({
  type: Joi.string().valid("Patient", "MedicalPractitioner"),
  email: Joi.string().lowercase(),
  name: Joi.string(),
});

async function searchUser(parent, args, { prisma, request }, info) {
  const userData = getUserData(request);

  if (!userData.verified) {
    throw new Error("Access Denied");
  }
  const result = await searchUserSchema.validate({
    name: args.data.name,
    email: args.data.email,
    type: args.data.type,
  });

  if (result.error) {
    throw new Error("Invalid Data");
  }

  if (typeof args.data.email === "string") {
    const type = args.data.type ? args.data.type : null;
    if (type) {
      const users = await prisma.query.users(
        {
          where: {
            AND: [
              {
                email_starts_with: args.data.email.toLowerCase(),
              },
              {
                role: args.data.type,
              },
              {
                ...(userData.role !== "DatabaseAdmin" && { verified: true }),
              },
            ],
          },
          orderBy: "firstName_ASC",
          first: 10,
        },
        info
      );
      return users;
    } else {
      const users = await prisma.query.users(
        {
          where: {
            AND: [
              {
                email_starts_with: args.data.email.toLowerCase(),
              },
              {
                role_not: "DatabaseAdmin",
              },
              {
                ...(userData.role !== "DatabaseAdmin" && { verified: true }),
              },
            ],
          },
          orderBy: "firstName_ASC",
          first: 10,
        },
        info
      );
      return users;
    }
  } else if (typeof args.data.name === "string") {
    const type = args.data.type ? args.data.type : null;
    if (type) {
      const users1 = await prisma.query.users(
        {
          where: {
            AND: [
              {
                firstName_starts_with: capitalizeFirstLetter(args.data.name),
              },
              {
                role: args.data.type,
              },
              {
                ...(userData.role !== "DatabaseAdmin" && { verified: true }),
              },
            ],
          },
          orderBy: "firstName_ASC",
          first: 10,
        },
        info
      );
      const users2 = await prisma.query.users(
        {
          where: {
            AND: [
              {
                lastName_starts_with: capitalizeFirstLetter(args.data.name),
              },
              {
                role: args.data.type,
              },
              {
                ...(userData.role !== "DatabaseAdmin" && { verified: true }),
              },
            ],
          },
          orderBy: "firstName_ASC",
          first: 10,
        },
        info
      );
      const users = [...users1, ...users2];
      return users;
    } else {
      const users1 = await prisma.query.users(
        {
          where: {
            AND: [
              {
                firstName_starts_with: capitalizeFirstLetter(args.data.name),
              },
              {
                role_not: "DatabaseAdmin",
              },
              {
                ...(userData.role !== "DatabaseAdmin" && { verified: true }),
              },
            ],
          },
          orderBy: "firstName_ASC",
          first: 10,
        },
        info
      );
      const users2 = await prisma.query.users(
        {
          where: {
            AND: [
              {
                lastName_starts_with: capitalizeFirstLetter(args.data.name),
              },
              {
                role_not: "DatabaseAdmin",
              },
              {
                ...(userData.role !== "DatabaseAdmin" && { verified: true }),
              },
            ],
          },
          orderBy: "firstName_ASC",
          first: 10,
        },
        info
      );
      const users = [...users1, ...users2];
      return users;
    }
  } else {
    throw new Error("Enter a Name or Email");
  }
}

export { searchUser, User };
