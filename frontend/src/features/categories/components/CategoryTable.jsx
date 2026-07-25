import { Link } from 'react-router-dom';

function CategoryTable({ categories, onDelete }) {
  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 className="m-0 font-weight-bold text-primary">Categories</h6>
        <Link to="/categories/new" className="btn btn-primary btn-sm">
          <i className="fas fa-plus fa-sm" /> New
        </Link>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-bordered" width="100%">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.category_name}</td>
                  <td>
                    <Link
                      to={`/categories/${category.id}/edit`}
                      className="btn btn-warning btn-sm mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(category.id)}
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

export default CategoryTable;
