import { useState } from 'react';
import { CategorySelect } from '../../categories';
import useCategories from '../../categories/hooks/useCategories';

function ProductForm({ initialValues, onSubmit, onCancel, loading }) {
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

export default ProductForm;
