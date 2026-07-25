import CustomerForm from './CustomerForm';

function CustomerModal({ show, title, initialValues, onClose, onSubmit, loading }) {
  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: 'block' }}
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" onClick={onClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <CustomerForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                onCancel={onClose}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
}

export default CustomerModal;
