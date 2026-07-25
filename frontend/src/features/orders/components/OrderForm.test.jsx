import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderForm from './OrderForm';

vi.mock('../../customers/hooks/useCustomers', () => ({
  default: () => ({
    customers: [{ id: 1, first_name: 'Alice', last_name: 'Smith' }],
  }),
}));

vi.mock('../../products/hooks/useProducts', () => ({
  default: () => ({
    products: [{ id: 1, product_name: 'Laptop', unit_price: 999.99 }],
  }),
}));

describe('OrderForm', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders Customer, Product, and Quantity labels', () => {
    render(<OrderForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByLabelText('Customer')).toBeInTheDocument();
    expect(screen.getByLabelText('Product')).toBeInTheDocument();
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument();
  });

  it('auto-computes total as $999.99 when Laptop is selected with quantity 1', async () => {
    const user = userEvent.setup();
    render(<OrderForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={false} />);
    await user.selectOptions(screen.getByLabelText('Product'), '1');
    await user.type(screen.getByLabelText('Quantity'), '1');
    expect(screen.getByDisplayValue('$999.99')).toBeInTheDocument();
  });

  it('calls onSubmit with correct parsed payload on form submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<OrderForm onSubmit={onSubmit} onCancel={vi.fn()} loading={false} />);
    await user.selectOptions(screen.getByLabelText('Customer'), '1');
    await user.selectOptions(screen.getByLabelText('Product'), '1');
    await user.type(screen.getByLabelText('Quantity'), '1');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({
      customer_id: 1,
      product_id: 1,
      quantity: 1,
      total: 999.99,
    });
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<OrderForm onSubmit={vi.fn()} onCancel={onCancel} loading={false} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows Saving... and disables the submit button when loading=true', () => {
    render(<OrderForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={true} />);
    const button = screen.getByRole('button', { name: 'Saving...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
