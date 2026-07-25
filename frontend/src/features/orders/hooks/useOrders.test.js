import { renderHook, waitFor, act } from '@testing-library/react';
import * as service from '../services/order.service';
import useOrders from './useOrders';

vi.mock('../services/order.service');

describe('useOrders', () => {
  afterEach(() => vi.restoreAllMocks());

  it('starts with loading=true, empty orders, and null error', async () => {
    service.getOrders.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHook(() => useOrders());
    expect(result.current.loading).toBe(true);
    expect(result.current.orders).toEqual([]);
    expect(result.current.error).toBeNull();
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('populates orders and sets loading=false on success', async () => {
    const items = [
      {
        id: 1,
        customer: { first_name: 'Alice', last_name: 'Smith' },
        product: { product_name: 'Laptop' },
        quantity: 2,
        total: 1999.98,
      },
    ];
    service.getOrders.mockResolvedValue({ data: { data: items } });
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.orders).toEqual(items);
    expect(result.current.error).toBeNull();
  });

  it('sets error from err.message when response is absent', async () => {
    service.getOrders.mockRejectedValue({ message: 'Network error' });
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
    expect(result.current.orders).toEqual([]);
  });

  it('sets error from response.data.message when available', async () => {
    service.getOrders.mockRejectedValue({
      response: { data: { message: 'Server error' } },
      message: 'Network error',
    });
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Server error');
  });

  it('refetch re-fetches and updates orders', async () => {
    const first = [
      {
        id: 1,
        customer: { first_name: 'Alice', last_name: 'Smith' },
        product: { product_name: 'Laptop' },
        quantity: 2,
        total: 1999.98,
      },
    ];
    const second = [
      ...first,
      {
        id: 2,
        customer: { first_name: 'Bob', last_name: 'Jones' },
        product: { product_name: 'Phone' },
        quantity: 1,
        total: 599.99,
      },
    ];
    service.getOrders
      .mockResolvedValueOnce({ data: { data: first } })
      .mockResolvedValueOnce({ data: { data: second } });
    const { result } = renderHook(() => useOrders());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.orders).toHaveLength(1);
    await act(async () => { await result.current.refetch(); });
    await waitFor(() => expect(result.current.orders).toHaveLength(2));
  });
});
