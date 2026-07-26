import axiosInstance from '../../../lib/axios';
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from './customer.service';

vi.mock('../../../lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('customer service', () => {
  afterEach(() => vi.restoreAllMocks());

  it('getCustomers calls GET /customers', async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: [] } });
    await getCustomers();
    expect(axiosInstance.get).toHaveBeenCalledWith('/customers');
  });

  it('getCustomerById calls GET /customers/:id', async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: {} } });
    await getCustomerById(5);
    expect(axiosInstance.get).toHaveBeenCalledWith('/customers/5');
  });

  it('createCustomer calls POST /customers with data', async () => {
    const data = {
      first_name: 'Alice',
      last_name: 'Smith',
      email: 'alice@example.com',
      telephone: '555-0100',
      address: '1 Main St',
    };
    axiosInstance.post.mockResolvedValue({ data: { data: { id: 1, ...data } } });
    await createCustomer(data);
    expect(axiosInstance.post).toHaveBeenCalledWith('/customers', data);
  });

  it('updateCustomer calls PUT /customers/:id with data', async () => {
    const data = {
      first_name: 'Alice',
      last_name: 'Jones',
      email: 'alice@example.com',
      telephone: '555-0101',
      address: '2 Main St',
    };
    axiosInstance.put.mockResolvedValue({ data: { data: { id: 5, ...data } } });
    await updateCustomer(5, data);
    expect(axiosInstance.put).toHaveBeenCalledWith('/customers/5', data);
  });

  it('deleteCustomer calls DELETE /customers/:id', async () => {
    axiosInstance.delete.mockResolvedValue({ data: { success: true } });
    await deleteCustomer(5);
    expect(axiosInstance.delete).toHaveBeenCalledWith('/customers/5');
  });

  it('propagates Axios rejection to the caller', async () => {
    axiosInstance.get.mockRejectedValue(new Error('Network error'));
    await expect(getCustomers()).rejects.toThrow('Network error');
  });
});
