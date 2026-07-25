'use strict';
const customerService = require('../../src/modules/customers/customer.service');
const customerRepository = require('../../src/database/repositories/customer.repository');

jest.mock('../../src/database/repositories/customer.repository');

describe('customerService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('getAllCustomers', () => {
    it('delegates to the repository and returns the result', async () => {
      const rows = [{ id: 1, first_name: 'Alice', last_name: 'Smith' }];
      customerRepository.findAll.mockResolvedValue(rows);

      const result = await customerService.getAllCustomers();

      expect(customerRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(rows);
    });
  });

  describe('getCustomerById', () => {
    it('returns the customer when found', async () => {
      const row = { id: 1, first_name: 'Alice', last_name: 'Smith' };
      customerRepository.findById.mockResolvedValue(row);

      const result = await customerService.getCustomerById(1);

      expect(customerRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(row);
    });

    it('throws a 404 error when the customer does not exist', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(customerService.getCustomerById(99)).rejects.toMatchObject({
        message: 'Customer not found',
        statusCode: 404,
      });
    });
  });

  describe('createCustomer', () => {
    it('passes the payload to the repository and returns the created row', async () => {
      const payload = { first_name: 'Bob', last_name: 'Jones', email: 'bob@example.com' };
      const created = { id: 2, ...payload };
      customerRepository.create.mockResolvedValue(created);

      const result = await customerService.createCustomer(payload);

      expect(customerRepository.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual(created);
    });
  });

  describe('updateCustomer', () => {
    it('updates and returns the refreshed customer', async () => {
      const before = { id: 1, first_name: 'Alice', last_name: 'Smith' };
      const after = { id: 1, first_name: 'Alice', last_name: 'Brown' };
      customerRepository.findById
        .mockResolvedValueOnce(before)
        .mockResolvedValueOnce(after);
      customerRepository.update.mockResolvedValue([1]);

      const result = await customerService.updateCustomer(1, { last_name: 'Brown' });

      expect(customerRepository.update).toHaveBeenCalledWith(1, { last_name: 'Brown' });
      expect(result).toEqual(after);
    });

    it('throws 404 when the customer does not exist', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(
        customerService.updateCustomer(99, { first_name: 'X' })
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('deleteCustomer', () => {
    it('calls destroy on the repository when the customer exists', async () => {
      customerRepository.findById.mockResolvedValue({ id: 1 });
      customerRepository.destroy.mockResolvedValue(1);

      await customerService.deleteCustomer(1);

      expect(customerRepository.destroy).toHaveBeenCalledWith(1);
    });

    it('throws 404 when the customer does not exist', async () => {
      customerRepository.findById.mockResolvedValue(null);

      await expect(customerService.deleteCustomer(99)).rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
