async function icdcodes(parent, args, { request, prisma }, info) {
  return prisma.query.iCDCodes(
    {
      where: {
        searchCommonName_contains: args.commonName
          .toLowerCase()
          .replace(" ", "-"),
      },
      orderBy: "icdCode_ASC",
      first: 15,
    },
    info
  );
}

export { icdcodes };
