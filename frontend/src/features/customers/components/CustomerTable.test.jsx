import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerTable from './CustomerTable';

const customers = [
  { id: 1, first_name: 'Alice', last_name: 'Smith', email: 'alice@example.com', telephone: '555-0100' },
  { id: 2, first_name: 'Bob', last_name: 'Jones', email: 'bob@example.com', telephone: '555-0200' },
];

describe('CustomerTable', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the column headers: #, First Name, Last Name, Email, Telephone, Actions', () => {
    render(<CustomerTable customers={[]} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Telephone')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('calls onNew when the New button is clicked', async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(<CustomerTable customers={[]} onNew={onNew} onEdit={vi.fn()} onDelete={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it('renders one row per customer with first name, last name, email, and telephone', () => {
    render(
      <CustomerTable customers={customers} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Smith')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('555-0100')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Jones')).toBeInTheDocument();
  });

  it('calls onEdit with the customer id when the Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <CustomerTable customers={customers} onNew={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />,
    );
    await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with the customer id when the Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <CustomerTable customers={customers} onNew={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />,
    );
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('shows "No customers found." when the customers list is empty', () => {
    render(<CustomerTable customers={[]} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No customers found.')).toBeInTheDocument();
  });
});
