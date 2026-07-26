import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategorySelect from './CategorySelect';

const categories = [
  { id: 1, category_name: 'Electronics' },
  { id: 2, category_name: 'Books' },
];

describe('CategorySelect', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders a Category label', () => {
    render(<CategorySelect value="" onChange={vi.fn()} categories={[]} />);
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('renders the default option with an empty value', () => {
    render(<CategorySelect value="" onChange={vi.fn()} categories={[]} />);
    expect(screen.getByRole('option', { name: '-- Select a category --' })).toHaveValue('');
  });

  it('renders one option per category', () => {
    render(<CategorySelect value="" onChange={vi.fn()} categories={categories} />);
    expect(screen.getByRole('option', { name: 'Electronics' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Books' })).toBeInTheDocument();
  });

  it('calls onChange with the string id value when selection changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CategorySelect value="" onChange={onChange} categories={categories} />);
    await user.selectOptions(screen.getByLabelText('Category'), 'Electronics');
    expect(onChange).toHaveBeenCalledWith('1');
  });
});
