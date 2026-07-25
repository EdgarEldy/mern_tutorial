import { Link } from 'react-router-dom';

function OrderTable({ orders, onDelete }) {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Orders</h6>
        <Link to="/orders/new" className="btn btn-primary btn-sm">
          <i className="fas fa-plus fa-sm" /> New
        </Link>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered" width="100%">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.customer?.first_name} {order.customer?.last_name}
                  </td>
                  <td>{order.product?.product_name ?? '-'}</td>
                  <td>{order.quantity}</td>
                  <td>${order.total}</td>
                  <td>
                    <Link
                      to={`/orders/${order.id}/edit`}
                      className="btn btn-warning btn-sm mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(order.id)}
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

export default OrderTable;
