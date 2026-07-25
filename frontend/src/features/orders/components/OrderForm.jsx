import { useState, useEffect } from 'react';
import { CustomerSelect } from '../../customers';
import { ProductSelect } from '../../products';
import useCustomers from '../../customers/hooks/useCustomers';
import useProducts from '../../products/hooks/useProducts';

function OrderForm({ initialValues, onSubmit, onCancel, loading }) {
  const [customerId, setCustomerId] = useState(initialValues?.customer_id ?? '');
  const [productId, setProductId] = useState(initialValues?.product_id ?? '');
  const [quantity, setQuantity] = useState(initialValues?.quantity ?? '');

  const { customers } = useCustomers();
  const { products } = useProducts();

  const selectedProduct = products.find((p) => String(p.id) === String(productId));
  const total =
    selectedProduct && quantity
      ? (selectedProduct.unit_price * Number(quantity)).toFixed(2)
      : '0.00';

  useEffect(() => {
    if (initialValues?.customer_id) setCustomerId(initialValues.customer_id);
    if (initialValues?.product_id) setProductId(initialValues.product_id);
    if (initialValues?.quantity) setQuantity(initialValues.quantity);
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      customer_id: parseInt(customerId, 10),
      product_id: parseInt(productId, 10),
      quantity: parseInt(quantity, 10),
      total: parseFloat(total),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CustomerSelect value={customerId} onChange={setCustomerId} customers={customers} />
      <ProductSelect value={productId} onChange={setProductId} products={products} />
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          min="1"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Total</label>
        <input type="text" className="form-control" value={`$${total}`} readOnly />
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

export default OrderForm;
