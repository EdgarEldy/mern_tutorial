function CategorySelect({ value, onChange, categories }) {
  return (
    <div className="form-group">
      <label htmlFor="categoryId">Category</label>
      <select
        id="categoryId"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">-- Select a category --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.category_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategorySelect;
