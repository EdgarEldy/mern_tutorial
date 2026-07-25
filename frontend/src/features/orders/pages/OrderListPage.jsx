import useOrders from '../hooks/useOrders';
import { deleteOrder } from '../services/order.service';
import OrderTable from '../components/OrderTable';

function OrderListPage() {
  const { orders, loading, error, refetch } = useOrders();

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await deleteOrder(id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Delete failed');
    }
  };

  if (loading) return <p className="p-3">Loading...</p>;
  if (error) return <p className="p-3 text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <OrderTable orders={orders} onDelete={handleDelete} />
    </div>
  );
}

export default OrderListPage;
