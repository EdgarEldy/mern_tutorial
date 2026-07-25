import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderTable from './OrderTable';

const orders = [
  {
    id: 1,
    customer: { first_name: 'Alice', last_name: 'Smith' },
    product: { product_name: 'Laptop' },
    quantity: 2,
    total: 1999.98,
  },
];

describe('OrderTable', () => {
  afterEach(() => vi.restoreAllMocks());

  it('calls onNew when the New button is clicked', async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(<OrderTable orders={[]} onNew={onNew} onEdit={vi.fn()} onDelete={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it('renders customer name, product name, quantity, and total for each row', () => {
    render(<OrderTable orders={orders} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText(/Smith/)).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$1999.98')).toBeInTheDocument();
  });

  it('renders "-" in the product column when product is null', () => {
    const orderWithoutProduct = [{ ...orders[0], product: null }];
    render(
      <OrderTable
        orders={orderWithoutProduct}
        onNew={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('calls onEdit with the order id when the Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<OrderTable orders={orders} onNew={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with the order id when the Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<OrderTable orders={orders} onNew={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('shows "No orders found." when the orders list is empty', () => {
    render(<OrderTable orders={[]} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No orders found.')).toBeInTheDocument();
  });
});
