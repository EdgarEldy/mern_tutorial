'use strict';

const baseTypeDefs = require('./typeDefs/base.typeDefs');
const baseResolvers = require('./resolvers/base.resolvers');
const orderTypeDefs = require('./typeDefs/order.typeDefs');
const orderResolvers = require('./resolvers/order.resolvers');

module.exports = {
  typeDefs: [baseTypeDefs, orderTypeDefs],
  resolvers: [baseResolvers, orderResolvers],
};
