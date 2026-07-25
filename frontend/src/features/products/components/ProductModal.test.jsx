import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ProductModal from './ProductModal';

vi.mock('../../categories/hooks/useCategories', () => ({
  default: () => ({ categories: [{ id: 1, category_name: 'Electronics' }] }),
}));

describe('ProductModal', () => {
  afterEach(() => vi.clearAllMocks());

  it('renders nothing when show is false', () => {
    const { container } = render(
      <ProductModal show={false} title="New Product" onClose={vi.fn()} onSubmit={vi.fn()} loading={false} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the title in the modal when show is true', () => {
    render(
      <ProductModal show={true} title="New Product" onClose={vi.fn()} onSubmit={vi.fn()} loading={false} />,
    );
    expect(screen.getByText('New Product')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ProductModal show={true} title="New Product" onClose={onClose} onSubmit={vi.fn()} loading={false} />,
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit with product data when form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ProductModal show={true} title="New Product" onClose={vi.fn()} onSubmit={onSubmit} loading={false} />,
    );
    await user.type(screen.getByLabelText('Product Name'), 'Laptop');
    await user.type(screen.getByLabelText('Unit Price'), '999.99');
    await user.selectOptions(screen.getByLabelText('Category'), '1');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSubmit).toHaveBeenCalledWith({
      product_name: 'Laptop',
      unit_price: 999.99,
      category_id: 1,
    });
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ProductModal show={true} title="New Product" onClose={onClose} onSubmit={vi.fn()} loading={false} />,
    );
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
