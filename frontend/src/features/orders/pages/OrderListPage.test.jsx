import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useOrders from '../hooks/useOrders';
import * as service from '../services/order.service';
import OrderListPage from './OrderListPage';

vi.mock('../hooks/useOrders');
vi.mock('../services/order.service');
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

const mockOrders = [
  {
    id: 1,
    customer: { first_name: 'Alice', last_name: 'Smith' },
    product: { product_name: 'Laptop' },
    quantity: 2,
    total: 1999.98,
  },
];

describe('OrderListPage', () => {
  let refetch;

  beforeEach(() => {
    refetch = vi.fn();
    useOrders.mockReturnValue({ orders: mockOrders, loading: false, error: null, refetch });
    service.createOrder.mockResolvedValue({});
    service.updateOrder.mockResolvedValue({});
    service.deleteOrder.mockResolvedValue({});
    service.getOrderById.mockResolvedValue({
      data: { data: { customer_id: 1, product_id: 1, quantity: 2, total: 1999.98 } },
    });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('shows Loading... when loading=true', () => {
    useOrders.mockReturnValue({ orders: [], loading: true, error: null, refetch: vi.fn() });
    render(<OrderListPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows the error message when error is set', () => {
    useOrders.mockReturnValue({
      orders: [],
      loading: false,
      error: 'Network error',
      refetch: vi.fn(),
    });
    render(<OrderListPage />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders the order table with data in the normal state', () => {
    render(<OrderListPage />);
    expect(screen.getByText(/Alice/)).toBeInTheDocument();
    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('$1999.98')).toBeInTheDocument();
  });

  it('opens New Order modal when New button is clicked', async () => {
    const user = userEvent.setup();
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    expect(screen.getByText('New Order')).toBeInTheDocument();
  });

  it('calls getOrderById and opens Edit Order modal when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(service.getOrderById).toHaveBeenCalledWith(1));
    expect(screen.getByText('Edit Order')).toBeInTheDocument();
  });

  it('calls deleteOrder and refetch when confirm returns true', async () => {
    const user = userEvent.setup();
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(service.deleteOrder).toHaveBeenCalledWith(1));
    expect(refetch).toHaveBeenCalled();
  });

  it('does not call deleteOrder when confirm returns false', async () => {
    const user = userEvent.setup();
    window.confirm.mockReturnValue(false);
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(service.deleteOrder).not.toHaveBeenCalled();
  });

  it('calls createOrder and refetch on New form submit with exact payload', async () => {
    const user = userEvent.setup();
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    await user.selectOptions(screen.getByLabelText('Customer'), '1');
    await user.selectOptions(screen.getByLabelText('Product'), '1');
    await user.type(screen.getByLabelText('Quantity'), '1');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(service.createOrder).toHaveBeenCalledWith({
        customer_id: 1,
        product_id: 1,
        quantity: 1,
        total: 999.99,
      }),
    );
    expect(refetch).toHaveBeenCalled();
  });

  it('calls updateOrder and refetch on Edit form submit with exact payload', async () => {
    const user = userEvent.setup();
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(screen.getByText('Edit Order')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(service.updateOrder).toHaveBeenCalledWith(1, {
        customer_id: 1,
        product_id: 1,
        quantity: 2,
        total: 1999.98,
      }),
    );
    expect(refetch).toHaveBeenCalled();
  });

  it('shows alert when getOrderById fails', async () => {
    const user = userEvent.setup();
    service.getOrderById.mockRejectedValue(new Error('Not found'));
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Failed to load order'));
  });

  it('shows alert when deleteOrder fails', async () => {
    const user = userEvent.setup();
    service.deleteOrder.mockRejectedValue({
      response: { data: { message: 'Delete failed' } },
    });
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Delete failed'));
  });

  it('shows alert with response.data.message when createOrder fails', async () => {
    const user = userEvent.setup();
    service.createOrder.mockRejectedValue({
      response: { data: { message: 'Validation failed' } },
    });
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    await user.selectOptions(screen.getByLabelText('Customer'), '1');
    await user.selectOptions(screen.getByLabelText('Product'), '1');
    await user.type(screen.getByLabelText('Quantity'), '1');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Validation failed'));
  });

  it('shows alert with "Save failed" fallback when updateOrder fails without response', async () => {
    const user = userEvent.setup();
    service.updateOrder.mockRejectedValue(new Error('Unknown error'));
    render(<OrderListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(screen.getByText('Edit Order')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Save failed'));
  });
});
