import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerForm from './CustomerForm';

describe('CustomerForm', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders inputs associated with all 5 field labels', () => {
    render(<CustomerForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Telephone')).toBeInTheDocument();
    expect(screen.getByLabelText('Address')).toBeInTheDocument();
  });

  it('pre-fills all fields when initialValues is provided', () => {
    const initialValues = {
      first_name: 'Alice',
      last_name: 'Smith',
      email: 'alice@example.com',
      telephone: '555-0100',
      address: '1 Main St',
    };
    render(
      <CustomerForm
        initialValues={initialValues}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        loading={false}
      />,
    );
    expect(screen.getByLabelText('First Name')).toHaveValue('Alice');
    expect(screen.getByLabelText('Last Name')).toHaveValue('Smith');
    expect(screen.getByLabelText('Email')).toHaveValue('alice@example.com');
    expect(screen.getByLabelText('Telephone')).toHaveValue('555-0100');
    expect(screen.getByLabelText('Address')).toHaveValue('1 Main St');
  });

  it('calls onSubmit with correct payload on form submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CustomerForm onSubmit={onSubmit} onCancel={vi.fn()} loading={false} />);
    await user.type(screen.getByLabelText('First Name'), 'Alice');
    await user.type(screen.getByLabelText('Last Name'), 'Smith');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.type(screen.getByLabelText('Telephone'), '555-0100');
    await user.type(screen.getByLabelText('Address'), '1 Main St');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({
      first_name: 'Alice',
      last_name: 'Smith',
      email: 'alice@example.com',
      telephone: '555-0100',
      address: '1 Main St',
    });
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<CustomerForm onSubmit={vi.fn()} onCancel={onCancel} loading={false} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows Saving... and disables the submit button when loading=true', () => {
    render(<CustomerForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={true} />);
    const button = screen.getByRole('button', { name: 'Saving...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('shows Save and enables the submit button when loading=false', () => {
    render(<CustomerForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={false} />);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});
