'use strict';

var path = require('path');
var mergeGraphqlSchemas = require('merge-graphql-schemas');
var fileLoader = mergeGraphqlSchemas.fileLoader;
var mergeTypes = mergeGraphqlSchemas.mergeTypes;

var typesArray = fileLoader(path.join(__dirname, '*.graphql'));

module.exports = mergeTypes(typesArray, {
    all: true
});