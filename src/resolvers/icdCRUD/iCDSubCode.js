async function icdsubcodes(parent, args, { request, prisma }, info) {
  return prisma.query.iCDSubCodes(
    {
      where: {
        AND: [
          {
            searchScientificName_contains: args.scientificName
              .toLowerCase()
              .replace(" ", "-"),
          },
          {
            icdCode: {
              searchCommonName_contains: args.commonName
                .toLowerCase()
                .replace(" ", "-"),
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
