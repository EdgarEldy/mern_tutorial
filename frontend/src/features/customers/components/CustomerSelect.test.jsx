import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerSelect from './CustomerSelect';

const customers = [
  { id: 1, first_name: 'Alice', last_name: 'Smith' },
  { id: 2, first_name: 'Bob', last_name: 'Jones' },
];

describe('CustomerSelect', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders a Customer label', () => {
    render(<CustomerSelect value="" onChange={vi.fn()} customers={[]} />);
    expect(screen.getByText('Customer')).toBeInTheDocument();
  });

  it('renders the default option with an empty value', () => {
    render(<CustomerSelect value="" onChange={vi.fn()} customers={[]} />);
    expect(screen.getByRole('option', { name: '-- Select a customer --' })).toHaveValue('');
  });

  it('renders one option per customer with "First Last" label', () => {
    render(<CustomerSelect value="" onChange={vi.fn()} customers={customers} />);
    expect(screen.getByRole('option', { name: 'Alice Smith' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Bob Jones' })).toBeInTheDocument();
  });

  it('each customer option has the customer id as its value', () => {
    render(<CustomerSelect value="" onChange={vi.fn()} customers={customers} />);
    expect(screen.getByRole('option', { name: 'Alice Smith' })).toHaveValue('1');
    expect(screen.getByRole('option', { name: 'Bob Jones' })).toHaveValue('2');
  });

  it('calls onChange with the string id value when selection changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CustomerSelect value="" onChange={onChange} customers={customers} />);
    await user.selectOptions(screen.getByLabelText('Customer'), 'Alice Smith');
    expect(onChange).toHaveBeenCalledWith('1');
  });
});
