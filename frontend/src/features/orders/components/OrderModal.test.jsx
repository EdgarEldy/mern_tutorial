import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OrderModal from './OrderModal';

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

describe('OrderModal', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders nothing when show=false', () => {
    const { container } = render(
      <OrderModal
        show={false}
        title="New Order"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal with the title in the header when show=true', () => {
    render(
      <OrderModal
        show={true}
        title="New Order"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    expect(screen.getByText('New Order')).toBeInTheDocument();
  });

  it('calls onClose when the close button (X) is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <OrderModal
        show={true}
        title="New Order"
        onClose={onClose}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the form Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <OrderModal
        show={true}
        title="New Order"
        onClose={onClose}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with correct payload when the inner form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <OrderModal
        show={true}
        title="New Order"
        onClose={vi.fn()}
        onSubmit={onSubmit}
        loading={false}
      />,
    );
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
});
