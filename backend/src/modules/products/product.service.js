'use strict';
const productRepository = require('../../database/repositories/product.repository');

const getAllProducts = () => productRepository.findAll();

const getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) {
    const err = new Error('Product not found');
    err.statusCode = 404;
    throw err;
  }
  return product;
};

const createProduct = (data) => productRepository.create(data);

const updateProduct = async (id, data) => {
  await getProductById(id);
  await productRepository.update(id, data);
  return productRepository.findById(id);
};

const deleteProduct = async (id) => {
  await getProductById(id);
  return productRepository.destroy(id);
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
