import { renderHook, waitFor, act } from '@testing-library/react';
import * as service from '../services/customer.service';
import useCustomers from './useCustomers';

vi.mock('../services/customer.service');

describe('useCustomers', () => {
  afterEach(() => vi.clearAllMocks());

  it('starts with loading=true, empty customers, and null error', async () => {
    service.getCustomers.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHook(() => useCustomers());
    expect(result.current.loading).toBe(true);
    expect(result.current.customers).toEqual([]);
    expect(result.current.error).toBeNull();
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('populates customers and sets loading=false on success', async () => {
    const items = [
      { id: 1, first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com', telephone: '555-0100', address: '1 Main St' },
    ];
    service.getCustomers.mockResolvedValue({ data: { data: items } });
    const { result } = renderHook(() => useCustomers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.customers).toEqual(items);
    expect(result.current.error).toBeNull();
  });

  it('sets error from err.message when response is absent', async () => {
    service.getCustomers.mockRejectedValue({ message: 'Network error' });
    const { result } = renderHook(() => useCustomers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
    expect(result.current.customers).toEqual([]);
  });

  it('sets error from response.data.message when available', async () => {
    service.getCustomers.mockRejectedValue({
      response: { data: { message: 'Server error' } },
      message: 'Network error',
    });
    const { result } = renderHook(() => useCustomers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Server error');
  });

  it('refetch re-fetches and updates customers', async () => {
    const first = [{ id: 1, first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com', telephone: '555-0100', address: '1 Main St' }];
    const second = [
      { id: 1, first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com', telephone: '555-0100', address: '1 Main St' },
      { id: 2, first_name: 'Bob', last_name: 'Jones', email: 'bob@example.com', telephone: '555-0200', address: '2 Main St' },
    ];
    service.getCustomers
      .mockResolvedValueOnce({ data: { data: first } })
      .mockResolvedValueOnce({ data: { data: second } });
    const { result } = renderHook(() => useCustomers());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.customers).toHaveLength(1);
    await act(async () => { await result.current.refetch(); });
    await waitFor(() => expect(result.current.customers).toHaveLength(2));
  });
});
