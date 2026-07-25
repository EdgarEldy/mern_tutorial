'use strict';

module.exports = `#graphql
  type Category {
    id: ID!
    category_name: String!
  }

  type Product {
    id: ID!
    product_name: String!
    unit_price: Float!
    category: Category
  }

  type Customer {
    id: ID!
    first_name: String
    last_name: String
    email: String
    telephone: String
    address: String
  }

  type Order {
    id: ID!
    quantity: Int!
    total: Float!
    customer: Customer
    product: Product
    createdAt: String
    updatedAt: String
  }

  input CreateOrderInput {
    customer_id: ID!
    product_id: ID!
    quantity: Int!
  }

  input UpdateOrderInput {
    customer_id: ID
    product_id: ID
    quantity: Int
  }

  extend type Query {
    orders: [Order!]!
    order(id: ID!): Order
  }

  extend type Mutation {
    createOrder(input: CreateOrderInput!): Order!
    updateOrder(id: ID!, input: UpdateOrderInput!): Order
    deleteOrder(id: ID!): Boolean!
  }
`;
