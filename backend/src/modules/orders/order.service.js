'use strict';
const orderRepository = require('../../database/repositories/order.repository');
const productRepository = require('../../database/repositories/product.repository');

const getAllOrders = () => orderRepository.findAll();

const getOrderById = async (id) => {
  const order = await orderRepository.findById(id);
  if (!order) {
    const err = new Error('Order not found');
    err.statusCode = 404;
    throw err;
  }
  return order;
};

const createOrder = async (data) => {
  const product = await productRepository.findById(data.product_id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  const total = data.quantity * product.unit_price;
  return orderRepository.create({ ...data, total });
};

const updateOrder = async (id, data) => {
  const order = await getOrderById(id);

  const productId = data.product_id || order.product_id;
  const quantity = data.quantity !== undefined ? data.quantity : order.quantity;

  const product = await productRepository.findById(productId);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }

  const total = quantity * product.unit_price;
  await orderRepository.update(id, { ...data, total });
  return orderRepository.findById(id);
};

const deleteOrder = async (id) => {
  await getOrderById(id);
  return orderRepository.destroy(id);
};

module.exports = { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder };
