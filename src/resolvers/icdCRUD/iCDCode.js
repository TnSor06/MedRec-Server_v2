async function icdcodes(parent, args, { request, prisma }, info) {
  return prisma.query.iCDCodes(
    {
      where: {
        commonName_contains: args.commonName,
      },
      orderBy: "icdCode_ASC",
      first: 15,
    },
    info
  );
}

export { icdcodes };
