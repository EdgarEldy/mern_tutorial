import axiosInstance from '../../../lib/axios';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from './order.service';

vi.mock('../../../lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('order service', () => {
  afterEach(() => vi.restoreAllMocks());

  it('getOrders calls GET /orders', async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: [] } });
    await getOrders();
    expect(axiosInstance.get).toHaveBeenCalledWith('/orders');
  });

  it('getOrderById calls GET /orders/:id', async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: {} } });
    await getOrderById(1);
    expect(axiosInstance.get).toHaveBeenCalledWith('/orders/1');
  });

  it('createOrder calls POST /orders with data', async () => {
    const data = { customer_id: 1, product_id: 1, quantity: 2, total: 1999.98 };
    axiosInstance.post.mockResolvedValue({ data: { data: { id: 1, ...data } } });
    await createOrder(data);
    expect(axiosInstance.post).toHaveBeenCalledWith('/orders', data);
  });

  it('updateOrder calls PUT /orders/:id with data', async () => {
    const data = { customer_id: 1, product_id: 1, quantity: 3, total: 2999.97 };
    axiosInstance.put.mockResolvedValue({ data: { data: { id: 1, ...data } } });
    await updateOrder(1, data);
    expect(axiosInstance.put).toHaveBeenCalledWith('/orders/1', data);
  });

  it('deleteOrder calls DELETE /orders/:id', async () => {
    axiosInstance.delete.mockResolvedValue({ data: { success: true } });
    await deleteOrder(1);
    expect(axiosInstance.delete).toHaveBeenCalledWith('/orders/1');
  });

  it('propagates Axios rejection to the caller', async () => {
    axiosInstance.get.mockRejectedValue(new Error('Network error'));
    await expect(getOrders()).rejects.toThrow('Network error');
  });
});
