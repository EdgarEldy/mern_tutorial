import useCustomers from '../hooks/useCustomers';
import { deleteCustomer } from '../services/customer.service';
import CustomerTable from '../components/CustomerTable';

function CustomerListPage() {
  const { customers, loading, error, refetch } = useCustomers();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Delete failed');
    }
  };

  if (loading) return <p className="p-3">Loading...</p>;
  if (error) return <p className="p-3 text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <CustomerTable customers={customers} onDelete={handleDelete} />
    </div>
  );
}

export default CustomerListPage;
