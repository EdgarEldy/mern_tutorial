function CustomerTable({ customers, onNew, onEdit, onDelete }) {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Customers</h6>
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Telephone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.first_name}</td>
                    <td>{customer.last_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.telephone}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => onEdit(customer.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(customer.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CustomerTable;
