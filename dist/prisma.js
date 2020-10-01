"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _prismaBinding = require("prisma-binding");

var _index = require("./resolvers/index");

var _config = require("config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prisma = new _prismaBinding.Prisma({
  typeDefs: "src/generated/prisma.graphql", // Specify typedefs not datamodel
  endpoint: process.env.PRISMA_ENDPOINT, // where prisma graphql api lives
  secret: _config2.default.get("prisma-secret"),
  fragmentReplacements: _index.fragmentReplacements
});

exports.default = prisma;