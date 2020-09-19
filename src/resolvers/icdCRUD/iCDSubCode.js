async function icdsubcodes(parent, args, { request, prisma }, info) {
  return prisma.query.iCDSubCodes(
    {
      where: {
        AND: [
          {
            scientificName_contains: args.scientificName,
          },
          {
            icdCode: {
              commonName_contains: args.commonName,
            },
          },
        ],
      },
      orderBy: "icdSubCode_ASC",
    },
    info
  );
}

export { icdsubcodes };
