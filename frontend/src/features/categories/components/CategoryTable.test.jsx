import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryTable from './CategoryTable';

const categories = [
  { id: 1, category_name: 'Electronics' },
  { id: 2, category_name: 'Books' },
];

describe('CategoryTable', () => {
  afterEach(() => vi.restoreAllMocks());

  it('calls onNew when the New button is clicked', async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    render(<CategoryTable categories={[]} onNew={onNew} onEdit={vi.fn()} onDelete={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    expect(onNew).toHaveBeenCalledTimes(1);
  });

  it('renders one row per category with id and category_name', () => {
    render(
      <CategoryTable categories={categories} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('calls onEdit with the category id when the Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <CategoryTable categories={categories} onNew={vi.fn()} onEdit={onEdit} onDelete={vi.fn()} />,
    );
    await user.click(screen.getAllByRole('button', { name: /edit/i })[0]);
    expect(onEdit).toHaveBeenCalledWith(1);
  });

  it('calls onDelete with the category id when the Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <CategoryTable categories={categories} onNew={vi.fn()} onEdit={vi.fn()} onDelete={onDelete} />,
    );
    await user.click(screen.getAllByRole('button', { name: /delete/i })[0]);
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('renders only the header row when categories array is empty', () => {
    render(<CategoryTable categories={[]} onNew={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getAllByRole('row')).toHaveLength(1);
  });
});
