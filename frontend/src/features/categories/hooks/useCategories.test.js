import { renderHook, waitFor, act } from '@testing-library/react';
import * as service from '../services/category.service';
import useCategories from './useCategories';

vi.mock('../services/category.service');

describe('useCategories', () => {
  afterEach(() => vi.clearAllMocks());

  it('starts with loading=true, empty categories, and null error', async () => {
    service.getCategories.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHook(() => useCategories());
    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBeNull();
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('populates categories and sets loading=false on success', async () => {
    const items = [{ id: 1, category_name: 'Electronics' }];
    service.getCategories.mockResolvedValue({ data: { data: items } });
    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.categories).toEqual(items);
    expect(result.current.error).toBeNull();
  });

  it('sets error from err.message when response is absent', async () => {
    service.getCategories.mockRejectedValue({ message: 'Network error' });
    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
    expect(result.current.categories).toEqual([]);
  });

  it('sets error from response.data.message when available', async () => {
    service.getCategories.mockRejectedValue({
      response: { data: { message: 'Server error' } },
      message: 'Network error',
    });
    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Server error');
  });

  it('refetch re-fetches and updates categories', async () => {
    const first = [{ id: 1, category_name: 'Electronics' }];
    const second = [
      { id: 1, category_name: 'Electronics' },
      { id: 2, category_name: 'Books' },
    ];
    service.getCategories
      .mockResolvedValueOnce({ data: { data: first } })
      .mockResolvedValueOnce({ data: { data: second } });
    const { result } = renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.categories).toHaveLength(1);
    await act(async () => { result.current.refetch(); });
    await waitFor(() => expect(result.current.categories).toHaveLength(2));
  });
});
