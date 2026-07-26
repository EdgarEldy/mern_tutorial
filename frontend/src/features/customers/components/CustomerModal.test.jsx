import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerModal from './CustomerModal';

describe('CustomerModal', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders nothing when show=false', () => {
    const { container } = render(
      <CustomerModal
        show={false}
        title="New Customer"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal with the title in the header when show=true', () => {
    render(
      <CustomerModal
        show={true}
        title="New Customer"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    expect(screen.getByText('New Customer')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CustomerModal
        show={true}
        title="New Customer"
        onClose={onClose}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with form data when the inner form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <CustomerModal
        show={true}
        title="New Customer"
        onClose={vi.fn()}
        onSubmit={onSubmit}
        loading={false}
      />,
    );
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

  it('calls onClose when the form Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CustomerModal
        show={true}
        title="New Customer"
        onClose={onClose}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
