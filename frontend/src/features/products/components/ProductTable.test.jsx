import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProductTable from './ProductTable';

const products = [
  { id: 1, product_name: 'Laptop', unit_price: 999.99, category: { category_name: 'Electronics' } },
  { id: 2, product_name: 'Phone', unit_price: 599.99, category: { category_name: 'Electronics' } },
];

describe('ProductTable', () => {
  it('calls onNew when the New button is clicked', async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(<ProductTable products={[]} onNew={onNew} onEdit={vi.fn()} onDelete={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it('displays product name, category name, and unit price with $ prefix', () => {
    const single = [products[0]];
    render(<ProductTable products={single} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('$999.99')).toBeInTheDocument();
  });

  it('shows "-" when a product has no category', () => {
    const withoutCategory = [{ id: 1, product_name: 'Uncategorized', unit_price: 10, category: null }];
    render(<ProductTable products={withoutCategory} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('calls onEdit with the product id when Edit is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<ProductTable products={products} onNew={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />);
    await user.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with the product id when Delete is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<ProductTable products={products} onNew={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />);
    await user.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('shows "No products found." when the products list is empty', () => {
    render(<ProductTable products={[]} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No products found.')).toBeInTheDocument();
  });
});
