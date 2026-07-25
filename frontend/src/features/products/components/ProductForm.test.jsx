import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProductForm from './ProductForm';

vi.mock('../../categories/hooks/useCategories', () => ({
  default: () => ({ categories: [{ id: 1, category_name: 'Electronics' }] }),
}));

describe('ProductForm', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders productName, unitPrice and Category fields', () => {
    render(<ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Unit Price')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('pre-fills fields from initialValues', () => {
    const initialValues = { product_name: 'Laptop', unit_price: 999.99, category_id: 1 };
    render(<ProductForm initialValues={initialValues} onSubmit={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByLabelText('Product Name')).toHaveValue('Laptop');
    expect(screen.getByLabelText('Unit Price')).toHaveValue(999.99);
    expect(screen.getByLabelText('Category')).toHaveValue('1');
  });

  it('calls onSubmit with parsed form data on submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ProductForm onSubmit={onSubmit} onCancel={vi.fn()} loading={false} />);
    await user.type(screen.getByLabelText('Product Name'), 'Laptop');
    await user.type(screen.getByLabelText('Unit Price'), '999.99');
    await user.selectOptions(screen.getByLabelText('Category'), '1');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({
      product_name: 'Laptop',
      unit_price: 999.99,
      category_id: 1,
    });
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ProductForm onSubmit={vi.fn()} onCancel={onCancel} loading={false} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows Saving... and disables submit button when loading is true', () => {
    render(<ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  });
});
