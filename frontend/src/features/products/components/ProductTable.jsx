function ProductTable({ products, onNew, onEdit, onDelete }) {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Products</h6>
        <button className="btn btn-primary btn-sm" onClick={onNew}>
          <i className="fas fa-plus fa-sm" /> New
        </button>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered" width="100%">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Unit Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">No products found.</td>
                </tr>
              )}
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.category?.category_name ?? '-'}</td>
                  <td>${product.unit_price}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm mr-2"
                      onClick={() => onEdit(product.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ProductTable;
