import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useCustomers from '../hooks/useCustomers';
import * as service from '../services/customer.service';
import CustomerListPage from './CustomerListPage';

vi.mock('../hooks/useCustomers');
vi.mock('../services/customer.service');

const mockData = [
  {
    id: 1,
    first_name: 'Alice',
    last_name: 'Smith',
    email: 'alice@example.com',
    telephone: '555-0100',
    address: '1 Main St',
  },
];

describe('CustomerListPage', () => {
  let refetch;

  beforeEach(() => {
    refetch = vi.fn();
    useCustomers.mockReturnValue({ customers: mockData, loading: false, error: null, refetch });
    service.createCustomer.mockResolvedValue({});
    service.updateCustomer.mockResolvedValue({});
    service.deleteCustomer.mockResolvedValue({});
    service.getCustomerById.mockResolvedValue({ data: { data: mockData[0] } });
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => vi.restoreAllMocks());

  it('shows Loading... when loading=true', () => {
    useCustomers.mockReturnValue({ customers: [], loading: true, error: null, refetch: vi.fn() });
    render(<CustomerListPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows the error message when error is set', () => {
    useCustomers.mockReturnValue({ customers: [], loading: false, error: 'Network error', refetch: vi.fn() });
    render(<CustomerListPage />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders the customer table with data in the normal state', () => {
    render(<CustomerListPage />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
  });

  it('opens New Customer modal when New button is clicked', async () => {
    const user = userEvent.setup();
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    expect(screen.getByText('New Customer')).toBeInTheDocument();
  });

  it('calls getCustomerById and opens Edit Customer modal when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(service.getCustomerById).toHaveBeenCalledWith(1));
    expect(screen.getByText('Edit Customer')).toBeInTheDocument();
  });

  it('calls deleteCustomer and refetch when confirm returns true', async () => {
    const user = userEvent.setup();
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(service.deleteCustomer).toHaveBeenCalledWith(1));
    expect(refetch).toHaveBeenCalled();
  });

  it('does not call deleteCustomer when confirm returns false', async () => {
    const user = userEvent.setup();
    window.confirm.mockReturnValue(false);
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(service.deleteCustomer).not.toHaveBeenCalled();
  });

  it('calls createCustomer and refetch on New form submit with exact payload', async () => {
    const user = userEvent.setup();
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    await user.type(screen.getByLabelText('First Name'), 'Bob');
    await user.type(screen.getByLabelText('Last Name'), 'Jones');
    await user.type(screen.getByLabelText('Email'), 'bob@example.com');
    await user.type(screen.getByLabelText('Telephone'), '555-0200');
    await user.type(screen.getByLabelText('Address'), '2 Main St');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(service.createCustomer).toHaveBeenCalledWith({
        first_name: 'Bob',
        last_name: 'Jones',
        email: 'bob@example.com',
        telephone: '555-0200',
        address: '2 Main St',
      }),
    );
    expect(refetch).toHaveBeenCalled();
  });

  it('calls updateCustomer and refetch on Edit form submit with exact payload', async () => {
    const user = userEvent.setup();
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(screen.getByText('Edit Customer')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(service.updateCustomer).toHaveBeenCalledWith(1, {
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'alice@example.com',
        telephone: '555-0100',
        address: '1 Main St',
      }),
    );
    expect(refetch).toHaveBeenCalled();
  });

  it('shows alert when getCustomerById fails', async () => {
    const user = userEvent.setup();
    service.getCustomerById.mockRejectedValue(new Error('Not found'));
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Failed to load customer'));
  });

  it('shows alert when deleteCustomer fails', async () => {
    const user = userEvent.setup();
    service.deleteCustomer.mockRejectedValue({ response: { data: { message: 'Delete failed' } } });
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Delete failed'));
  });

  it('shows alert with response.data.message when createCustomer fails', async () => {
    const user = userEvent.setup();
    service.createCustomer.mockRejectedValue({ response: { data: { message: 'Validation failed' } } });
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    await user.type(screen.getByLabelText('First Name'), 'Bob');
    await user.type(screen.getByLabelText('Last Name'), 'Jones');
    await user.type(screen.getByLabelText('Email'), 'bob@example.com');
    await user.type(screen.getByLabelText('Telephone'), '555-0200');
    await user.type(screen.getByLabelText('Address'), '2 Main St');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Validation failed'));
  });

  it('shows alert with "Save failed" fallback when updateCustomer fails without response', async () => {
    const user = userEvent.setup();
    service.updateCustomer.mockRejectedValue(new Error('Unknown error'));
    render(<CustomerListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(screen.getByText('Edit Customer')).toBeInTheDocument());
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Save failed'));
  });
});
