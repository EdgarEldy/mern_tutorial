import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CategorySelect } from '../../categories';
import useCategories from '../../categories/hooks/useCategories';

function ProductForm({ initialValues, onSubmit, loading }) {
  const [productName, setProductName] = useState(initialValues?.product_name ?? '');
  const [unitPrice, setUnitPrice] = useState(initialValues?.unit_price ?? '');
  const [categoryId, setCategoryId] = useState(initialValues?.category_id ?? '');

  const { categories } = useCategories();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      product_name: productName,
      unit_price: parseFloat(unitPrice),
      category_id: parseInt(categoryId, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="productName">Product Name</label>
        <input
          id="productName"
          type="text"
          className="form-control"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="unitPrice">Unit Price</label>
        <input
          id="unitPrice"
          type="number"
          step="0.01"
          min="0"
          className="form-control"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
          required
        />
      </div>
      <CategorySelect value={categoryId} onChange={setCategoryId} categories={categories} />
      <button type="submit" className="btn btn-primary mr-2" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
      </button>
      <Link to="/products" className="btn btn-secondary">
        Cancel
      </Link>
    </form>
  );
}

export default ProductForm;
