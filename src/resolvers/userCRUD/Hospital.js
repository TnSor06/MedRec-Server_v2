import Joi from "joi";
import { capitalizeFirstLetter } from "../../utils/misc";

const query = Joi.object().keys({
  name: Joi.string().required(),
  skip: Joi.number().required(),
});

async function getHospital(parent, args, { prisma }, info) {
  const result = await query.validate({
    name: args.name,
    skip: args.skip,
  });
  if (result.error) {
    throw new Error("Invalid Data");
  }
  const name = capitalizeFirstLetter(args.name);
  const hospital = await prisma.query.hospitals(
    {
      where: {
        searchName_contains: name.toLowerCase().replace(" ", "-"),
      },
      orderBy: "searchName_ASC",
      first: 20,
      skip: args.skip,
    },
    info
  );
  return hospital;
}

export { getHospital };
