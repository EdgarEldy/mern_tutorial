import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useCategories from '../hooks/useCategories';
import * as service from '../services/category.service';
import CategoryListPage from './CategoryListPage';

vi.mock('../hooks/useCategories');
vi.mock('../services/category.service');

const mockData = [{ id: 1, category_name: 'Electronics' }];

describe('CategoryListPage', () => {
  let mockRefetch;
  let confirmSpy;

  beforeEach(() => {
    mockRefetch = vi.fn();
    useCategories.mockReturnValue({
      categories: mockData,
      loading: false,
      error: null,
      refetch: mockRefetch,
    });
    confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows Loading... when loading=true', () => {
    useCategories.mockReturnValue({ categories: [], loading: true, error: null, refetch: vi.fn() });
    render(<CategoryListPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows the error message when error is set', () => {
    useCategories.mockReturnValue({
      categories: [],
      loading: false,
      error: 'Network error',
      refetch: vi.fn(),
    });
    render(<CategoryListPage />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders the category table with data in the normal state', () => {
    render(<CategoryListPage />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('opens New Category modal when New button is clicked', async () => {
    const user = userEvent.setup();
    render(<CategoryListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    expect(screen.getByText('New Category')).toBeInTheDocument();
  });

  it('calls getCategoryById and opens Edit Category modal when Edit button is clicked', async () => {
    const user = userEvent.setup();
    service.getCategoryById.mockResolvedValue({
      data: { data: { id: 1, category_name: 'Electronics' } },
    });
    render(<CategoryListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(service.getCategoryById).toHaveBeenCalledWith(1));
    expect(screen.getByText('Edit Category')).toBeInTheDocument();
  });

  it('calls deleteCategory and refetch when confirm returns true', async () => {
    const user = userEvent.setup();
    service.deleteCategory.mockResolvedValue({});
    render(<CategoryListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(service.deleteCategory).toHaveBeenCalledWith(1));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('does not call deleteCategory when confirm returns false', async () => {
    const user = userEvent.setup();
    confirmSpy.mockReturnValue(false);
    render(<CategoryListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(service.deleteCategory).not.toHaveBeenCalled();
  });

  it('calls createCategory and refetch when New form is submitted', async () => {
    const user = userEvent.setup();
    service.createCategory.mockResolvedValue({});
    render(<CategoryListPage />);
    await user.click(screen.getByRole('button', { name: /new/i }));
    await user.type(screen.getByLabelText('Category Name'), 'Books');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(service.createCategory).toHaveBeenCalledWith({ category_name: 'Books' }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('calls updateCategory and refetch when Edit form is submitted', async () => {
    const user = userEvent.setup();
    service.getCategoryById.mockResolvedValue({ data: { data: { id: 1, category_name: 'Electronics' } } });
    service.updateCategory.mockResolvedValue({});
    render(<CategoryListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(screen.getByText('Edit Category')).toBeInTheDocument());
    await user.clear(screen.getByLabelText('Category Name'));
    await user.type(screen.getByLabelText('Category Name'), 'Updated');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(service.updateCategory).toHaveBeenCalledWith(1, { category_name: 'Updated' }));
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('shows alert when getCategoryById fails', async () => {
    const user = userEvent.setup();
    service.getCategoryById.mockRejectedValue(new Error('Not found'));
    render(<CategoryListPage />);
    await user.click(screen.getByRole('button', { name: /edit/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Failed to load category'));
  });

  it('shows alert when deleteCategory fails', async () => {
    const user = userEvent.setup();
    service.deleteCategory.mockRejectedValue({ response: { data: { message: 'Delete failed' } } });
    render(<CategoryListPage />);
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Delete failed'));
  });
});
