import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryModal from './CategoryModal';

describe('CategoryModal', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders nothing when show=false', () => {
    const { container } = render(
      <CategoryModal
        show={false}
        title="New Category"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the modal with the title in h5.modal-title when show=true', () => {
    render(
      <CategoryModal
        show={true}
        title="New Category"
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    expect(screen.getByText('New Category')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <CategoryModal
        show={true}
        title="New Category"
        onClose={onClose}
        onSubmit={vi.fn()}
        loading={false}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
