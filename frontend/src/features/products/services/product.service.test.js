import { vi } from 'vitest';
import axiosInstance from '../../../lib/axios';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './product.service';

vi.mock('../../../lib/axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Product service', () => {
  afterEach(() => vi.clearAllMocks());

  it('getProducts calls GET /products', async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: [] } });
    await getProducts();
    expect(axiosInstance.get).toHaveBeenCalledWith('/products');
  });

  it('getProductById calls GET /products/:id', async () => {
    axiosInstance.get.mockResolvedValue({ data: { data: {} } });
    await getProductById(1);
    expect(axiosInstance.get).toHaveBeenCalledWith('/products/1');
  });

  it('createProduct calls POST /products with data', async () => {
    const payload = { product_name: 'Laptop', unit_price: 999.99, category_id: 1 };
    axiosInstance.post.mockResolvedValue({ data: { data: { id: 1, ...payload } } });
    await createProduct(payload);
    expect(axiosInstance.post).toHaveBeenCalledWith('/products', payload);
  });

  it('updateProduct calls PUT /products/:id with data', async () => {
    const payload = { product_name: 'Updated Laptop', unit_price: 899.99, category_id: 1 };
    axiosInstance.put.mockResolvedValue({ data: { data: { id: 1, ...payload } } });
    await updateProduct(1, payload);
    expect(axiosInstance.put).toHaveBeenCalledWith('/products/1', payload);
  });

  it('deleteProduct calls DELETE /products/:id', async () => {
    axiosInstance.delete.mockResolvedValue({ data: { data: {} } });
    await deleteProduct(1);
    expect(axiosInstance.delete).toHaveBeenCalledWith('/products/1');
  });

  it('propagates rejection from axios', async () => {
    axiosInstance.get.mockRejectedValue(new Error('Network error'));
    await expect(getProducts()).rejects.toThrow('Network error');
  });
});
