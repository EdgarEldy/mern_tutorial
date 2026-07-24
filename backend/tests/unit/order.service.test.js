'use strict';
const orderService = require('../../src/modules/orders/order.service');
const orderRepository = require('../../src/database/repositories/order.repository');
const productRepository = require('../../src/database/repositories/product.repository');

jest.mock('../../src/database/repositories/order.repository');
jest.mock('../../src/database/repositories/product.repository');

describe('orderService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllOrders', () => {
    it('delegates to the repository and returns the result', async () => {
      const rows = [{ id: 1, quantity: 2, total: 59.98 }];
      orderRepository.findAll.mockResolvedValue(rows);

      const result = await orderService.getAllOrders();

      expect(orderRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(rows);
    });
  });

  describe('getOrderById', () => {
    it('returns the order when found', async () => {
      const row = { id: 1, quantity: 2, total: 59.98 };
      orderRepository.findById.mockResolvedValue(row);

      const result = await orderService.getOrderById(1);

      expect(orderRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(row);
    });

    it('throws a 404 error when the order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(orderService.getOrderById(99)).rejects.toMatchObject({
        message: 'Order not found',
        statusCode: 404,
      });
    });
  });

  describe('createOrder', () => {
    it('computes total from quantity * unit_price and persists the order', async () => {
      const product = { id: 1, unit_price: 29.99 };
      const created = { id: 1, customer_id: 1, product_id: 1, quantity: 2, total: 59.98 };
      productRepository.findById.mockResolvedValue(product);
      orderRepository.create.mockResolvedValue(created);

      const result = await orderService.createOrder({ customer_id: 1, product_id: 1, quantity: 2 });

      expect(productRepository.findById).toHaveBeenCalledWith(1);
      expect(orderRepository.create).toHaveBeenCalledWith({
        customer_id: 1,
        product_id: 1,
        quantity: 2,
        total: 59.98,
      });
      expect(result).toEqual(created);
    });

    it('throws 404 when the referenced product does not exist', async () => {
      productRepository.findById.mockResolvedValue(null);

      await expect(
        orderService.createOrder({ customer_id: 1, product_id: 99, quantity: 1 })
      ).rejects.toMatchObject({ message: 'Product not found', statusCode: 404 });
    });
  });

  describe('updateOrder', () => {
    it('recomputes total when quantity changes', async () => {
      const existing = { id: 1, product_id: 1, quantity: 2, total: 59.98 };
      const product = { id: 1, unit_price: 29.99 };
      const updated = { id: 1, product_id: 1, quantity: 3, total: 89.97 };
      orderRepository.findById
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(updated);
      productRepository.findById.mockResolvedValue(product);
      orderRepository.update.mockResolvedValue([1]);

      const result = await orderService.updateOrder(1, { quantity: 3 });

      expect(orderRepository.update).toHaveBeenCalledWith(1, { quantity: 3, total: 89.97 });
      expect(result).toEqual(updated);
    });

    it('throws 404 when the order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(orderService.updateOrder(99, { quantity: 1 })).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });

  describe('deleteOrder', () => {
    it('calls destroy on the repository when the order exists', async () => {
      orderRepository.findById.mockResolvedValue({ id: 1 });
      orderRepository.destroy.mockResolvedValue(1);

      await orderService.deleteOrder(1);

      expect(orderRepository.destroy).toHaveBeenCalledWith(1);
    });

    it('throws 404 when the order does not exist', async () => {
      orderRepository.findById.mockResolvedValue(null);

      await expect(orderService.deleteOrder(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
