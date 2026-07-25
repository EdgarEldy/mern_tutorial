'use strict';

const orderService = require('../../modules/orders/order.service');

module.exports = {
  Query: {
    orders: () => orderService.getAllOrders(),
    order: (_, { id }) => orderService.getOrderById(id),
  },
  Mutation: {
    createOrder: (_, { input }) => orderService.createOrder(input),
    updateOrder: (_, { id, input }) => orderService.updateOrder(id, input),
    deleteOrder: async (_, { id }) => {
      await orderService.deleteOrder(id);
      return true;
    },
  },
};
