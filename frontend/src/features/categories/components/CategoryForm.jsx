import { useState } from 'react';

function CategoryForm({ initialValues, onSubmit, onCancel, loading }) {
  const [categoryName, setCategoryName] = useState(initialValues?.category_name ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ category_name: categoryName });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="categoryName">Category Name</label>
        <input
          id="categoryName"
          type="text"
          className="form-control"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
      </div>
      <div className="modal-footer px-0 pb-0">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default CategoryForm;
