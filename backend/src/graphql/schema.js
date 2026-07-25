'use strict';

const baseTypeDefs = require('./typeDefs/base.typeDefs');
const baseResolvers = require('./resolvers/base.resolvers');

module.exports = {
  typeDefs: [baseTypeDefs],
  resolvers: [baseResolvers],
};
