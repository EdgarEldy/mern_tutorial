import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import useProducts from '../hooks/useProducts';
import * as service from '../services/product.service';
import ProductListPage from './ProductListPage';

vi.mock('../hooks/useProducts');
vi.mock('../services/product.service');
vi.mock('../../categories/hooks/useCategories', () => ({
  default: () => ({ categories: [{ id: 1, category_name: 'Electronics' }] }),
}));

const mockProducts = [
  {
    id: 1,
    product_name: 'Laptop',
    unit_price: 999.99,
    category_id: 1,
    category: { category_name: 'Electronics' },
  },
];

describe('ProductListPage', () => {
  let refetch;

  beforeEach(() => {
    refetch = vi.fn();
    useProducts.mockReturnValue({ products: mockProducts, loading: false, error: null, refetch });
    service.createProduct.mockResolvedValue({});
    service.updateProduct.mockResolvedValue({});
    service.deleteProduct.mockResolvedValue({});
    service.getProductById.mockResolvedValue({ data: { data: mockProducts[0] } });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('shows loading state', () => {
    useProducts.mockReturnValue({ products: [], loading: true, error: null, refetch: vi.fn() });
    render(<ProductListPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows error state', () => {
    useProducts.mockReturnValue({ products: [], loading: false, error: 'Network error', refetch: vi.fn() });
    render(<ProductListPage />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders the product table with data', () => {
    render(<ProductListPage />);
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('$999.99')).toBeInTheDocument();
  });

  it('opens New Product modal when New button is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    expect(screen.getByText('New Product')).toBeInTheDocument();
  });

  it('opens Edit Product modal and calls getProductById', async () => {
    const user = userEvent.setup();
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await waitFor(() => expect(screen.getByText('Edit Product')).toBeInTheDocument());
    expect(service.getProductById).toHaveBeenCalledWith(1);
  });

  it('calls deleteProduct and refetch when delete is confirmed', async () => {
    const user = userEvent.setup();
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(service.deleteProduct).toHaveBeenCalledWith(1));
    expect(refetch).toHaveBeenCalled();
  });

  it('does not call deleteProduct when delete is cancelled', async () => {
    const user = userEvent.setup();
    window.confirm.mockReturnValue(false);
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(service.deleteProduct).not.toHaveBeenCalled();
  });

  it('calls createProduct and refetch on New form submit', async () => {
    const user = userEvent.setup();
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    await user.type(screen.getByLabelText('Product Name'), 'Tablet');
    await user.type(screen.getByLabelText('Unit Price'), '499.99');
    await user.selectOptions(screen.getByLabelText('Category'), '1');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(service.createProduct).toHaveBeenCalledWith({
        product_name: 'Tablet',
        unit_price: 499.99,
        category_id: 1,
      }),
    );
    expect(refetch).toHaveBeenCalled();
  });

  it('calls updateProduct and refetch on Edit form submit', async () => {
    const user = userEvent.setup();
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await waitFor(() => expect(screen.getByText('Edit Product')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(service.updateProduct).toHaveBeenCalledWith(1, {
        product_name: 'Laptop',
        unit_price: 999.99,
        category_id: 1,
      }),
    );
    expect(refetch).toHaveBeenCalled();
  });

  it('shows alert when getProductById fails', async () => {
    const user = userEvent.setup();
    service.getProductById.mockRejectedValue(new Error('Server error'));
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Failed to load product'));
  });

  it('shows alert when deleteProduct fails', async () => {
    const user = userEvent.setup();
    service.deleteProduct.mockRejectedValue({ response: { data: { message: 'Delete failed' } } });
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Delete failed'));
  });

  it('shows alert when createProduct fails on New form submit', async () => {
    const user = userEvent.setup();
    service.createProduct.mockRejectedValue({ response: { data: { message: 'Create failed' } } });
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    await user.type(screen.getByLabelText('Product Name'), 'Tablet');
    await user.type(screen.getByLabelText('Unit Price'), '499.99');
    await user.selectOptions(screen.getByLabelText('Category'), '1');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Create failed'));
  });

  it('shows alert when updateProduct fails on Edit form submit', async () => {
    const user = userEvent.setup();
    service.updateProduct.mockRejectedValue(new Error('Update failed'));
    render(<ProductListPage />);
    await user.click(screen.getByRole('button', { name: 'Edit' }));
    await waitFor(() => expect(screen.getByText('Edit Product')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Save failed'));
  });
});
