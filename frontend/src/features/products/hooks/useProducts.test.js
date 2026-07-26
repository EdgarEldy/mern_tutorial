import { renderHook, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
import * as service from '../services/product.service';
import useProducts from './useProducts';

vi.mock('../services/product.service');

describe('useProducts', () => {
  afterEach(() => vi.clearAllMocks());

  it('starts with loading=true and empty products list', async () => {
    service.getProducts.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHook(() => useProducts());
    expect(result.current.loading).toBe(true);
    expect(result.current.products).toEqual([]);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('populates products on success', async () => {
    const items = [
      { id: 1, product_name: 'Laptop', unit_price: 999.99, category_id: 1 },
    ];
    service.getProducts.mockResolvedValue({ data: { data: items } });
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual(items);
  });

  it('sets error on failure', async () => {
    service.getProducts.mockRejectedValue({ message: 'Network error' });
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
  });

  it('sets error from response message when available', async () => {
    service.getProducts.mockRejectedValue({
      response: { data: { message: 'Server error' } },
      message: 'Request failed',
    });
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Server error');
  });

  it('refetch re-calls getProducts', async () => {
    const items = [{ id: 1, product_name: 'Laptop', unit_price: 999.99, category_id: 1 }];
    service.getProducts.mockResolvedValue({ data: { data: items } });
    const { result } = renderHook(() => useProducts());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.refetch(); });
    expect(service.getProducts).toHaveBeenCalledTimes(2);
  });
});
