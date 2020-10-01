import "@babel/polyfill";
import { GraphQLServer } from "graphql-yoga";
import express from "express";
import { resolvers, fragmentReplacements } from "./resolvers/index";

import prisma from "./prisma";
import allTypes from "./schema/index";
const startup_debug = require("debug")("app:startup");
const url = require("url");

const port = process.env.PORT || 4000;

const server = new GraphQLServer({
  typeDefs: allTypes,
  resolvers,
  fragmentReplacements,
  context(request) {
    return {
      prisma,
      request,
    };
  },
});

server.express.use(express.static("build"));

server.express.get("/", express.static("build"));

server.express.get("*", (req, res, next) => {
  // small logic ..
  const routes = ["/graphql", "/subscriptions", "/playground"];

  if (routes.includes(req.url)) {
    return next();
  }
  // here you can use your way to get the path dir ..
  res.redirect(
    url.format({
      pathname: "/",
      query: {
        redirect: req.url,
      },
    })
  );
});

const options = {
  port: port,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground",
};

server.start(options, (server_meta) => {
  startup_debug("Server is Up\n", server_meta);
});
