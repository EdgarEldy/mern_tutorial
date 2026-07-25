'use strict';

module.exports = `#graphql
  type Query {
    _health: String
  }

  type Mutation {
    _empty: Boolean
  }
`;
