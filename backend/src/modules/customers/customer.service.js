'use strict';
const customerRepository = require('../../database/repositories/customer.repository');

const getAllCustomers = () => customerRepository.findAll();

const getCustomerById = async (id) => {
  const customer = await customerRepository.findById(id);
  if (!customer) {
    const err = new Error('Customer not found');
    err.statusCode = 404;
    throw err;
  }
  return customer;
};

const createCustomer = (data) => customerRepository.create(data);

const updateCustomer = async (id, data) => {
  await getCustomerById(id);
  await customerRepository.update(id, data);
  return customerRepository.findById(id);
};

const deleteCustomer = async (id) => {
  await getCustomerById(id);
  return customerRepository.destroy(id);
};

module.exports = { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer };
