import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProductSelect from './ProductSelect';

const products = [
  { id: 1, product_name: 'Laptop', unit_price: 999.99 },
  { id: 2, product_name: 'Phone', unit_price: 599.99 },
];

describe('ProductSelect', () => {
  it('renders the Product label', () => {
    render(<ProductSelect value="" onChange={vi.fn()} products={[]} />);
    expect(screen.getByLabelText('Product')).toBeInTheDocument();
  });

  it('renders the default placeholder option', () => {
    render(<ProductSelect value="" onChange={vi.fn()} products={[]} />);
    expect(screen.getByRole('option', { name: '-- Select a product --' })).toBeInTheDocument();
  });

  it('renders options in the format "{product_name} ($unit_price)"', () => {
    render(<ProductSelect value="" onChange={vi.fn()} products={products} />);
    expect(screen.getByRole('option', { name: 'Laptop ($999.99)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Phone ($599.99)' })).toBeInTheDocument();
  });

  it('calls onChange with the string value when an option is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ProductSelect value="" onChange={onChange} products={products} />);
    await user.selectOptions(screen.getByLabelText('Product'), '1');
    expect(onChange).toHaveBeenCalledWith('1');
  });
});
