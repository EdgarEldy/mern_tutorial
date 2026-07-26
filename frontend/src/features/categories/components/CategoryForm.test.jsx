import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryForm from './CategoryForm';

describe('CategoryForm', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders an input associated with the Category Name label', () => {
    render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={false} />);
    expect(screen.getByLabelText('Category Name')).toBeInTheDocument();
  });

  it('pre-fills the input when initialValues.category_name is provided', () => {
    render(
      <CategoryForm
        initialValues={{ category_name: 'Electronics' }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        loading={false}
      />,
    );
    expect(screen.getByLabelText('Category Name')).toHaveValue('Electronics');
  });

  it('calls onSubmit with category_name on form submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CategoryForm onSubmit={onSubmit} onCancel={vi.fn()} loading={false} />);
    await user.type(screen.getByLabelText('Category Name'), 'Books');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({ category_name: 'Books' });
  });

  it('calls onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<CategoryForm onSubmit={vi.fn()} onCancel={onCancel} loading={false} />);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('shows Saving... and disables the submit button when loading=true', () => {
    render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={true} />);
    const button = screen.getByRole('button', { name: 'Saving...' });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('shows Save and enables the submit button when loading=false', () => {
    render(<CategoryForm onSubmit={vi.fn()} onCancel={vi.fn()} loading={false} />);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});
