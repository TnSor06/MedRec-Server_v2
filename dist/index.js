"use strict";

require("@babel/polyfill");

var _graphqlYoga = require("graphql-yoga");

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _index = require("./resolvers/index");

var _prisma = require("./prisma");

var _prisma2 = _interopRequireDefault(_prisma);

var _index2 = require("./schema/index");

var _index3 = _interopRequireDefault(_index2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startup_debug = require("debug")("app:startup");
var url = require("url");

var port = process.env.PORT || 4000;

var server = new _graphqlYoga.GraphQLServer({
  typeDefs: _index3.default,
  resolvers: _index.resolvers,
  fragmentReplacements: _index.fragmentReplacements,
  context: function context(request) {
    return {
      prisma: _prisma2.default,
      request: request
    };
  }
});

server.express.use(_express2.default.static("build"));

server.express.get("/", _express2.default.static("build"));

server.express.get("*", function (req, res, next) {
  // small logic ..
  var routes = ["/graphql", "/subscriptions", "/playground"];

  if (routes.includes(req.url)) {
    return next();
  }
  // here you can use your way to get the path dir ..
  res.redirect(url.format({
    pathname: "/",
    query: {
      redirect: req.url
    }
  }));
});

var options = {
  port: port,
  endpoint: "/graphql",
  subscriptions: "/subscriptions",
  playground: "/playground"
};

server.start(options, function (server_meta) {
  startup_debug("Server is Up\n", server_meta);
});