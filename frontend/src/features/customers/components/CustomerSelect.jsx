function CustomerSelect({ value, onChange, customers }) {
  return (
    <div className="form-group">
      <label htmlFor="customerId">Customer</label>
      <select
        id="customerId"
        className="form-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">-- Select a customer --</option>
        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.first_name} {customer.last_name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CustomerSelect;
