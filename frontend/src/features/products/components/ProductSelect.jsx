function ProductSelect({ value, onChange, products }) {
  return (
    <div className="form-group">
      <label htmlFor="productId">Product</label>
      <select
        id="productId"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">-- Select a product --</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.product_name} (${product.unit_price})
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductSelect;
