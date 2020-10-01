import { Prisma } from "prisma-binding";

import { fragmentReplacements } from "./resolvers/index";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql", // Specify typedefs not datamodel
  endpoint: process.env.PRISMA_ENDPOINT, // where prisma graphql api lives
  secret: process.env.PRISMA_SECRET,
  fragmentReplacements,
});

export { prisma as default };
