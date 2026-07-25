import { useState } from 'react';
import { Link } from 'react-router-dom';

function CategoryForm({ initialValues, onSubmit, loading }) {
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
      <button type="submit" className="btn btn-primary mr-2" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
      <Link to="/categories" className="btn btn-secondary">
        Cancel
      </Link>
    </form>
  );
}

export default CategoryForm;
