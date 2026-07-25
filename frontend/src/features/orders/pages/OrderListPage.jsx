import { useState } from 'react';
import useOrders from '../hooks/useOrders';
import {
  createOrder,
  deleteOrder,
  getOrderById,
  updateOrder,
} from '../services/order.service';
import OrderTable from '../components/OrderTable';
import OrderModal from '../components/OrderModal';

function OrderListPage() {
  const { orders, loading, error, refetch } = useOrders();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setInitialValues(null);
    setModalTitle('New Order');
    setShowModal(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await getOrderById(id);
      setEditingId(id);
      setInitialValues(res.data.data);
      setModalTitle('Edit Order');
      setShowModal(true);
    } catch {
      alert('Failed to load order');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setInitialValues(null);
  };

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      if (editingId) {
        await updateOrder(editingId, data);
      } else {
        await createOrder(data);
      }
      closeModal();
      refetch();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

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
      <OrderTable
        orders={orders}
        onNew={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <OrderModal
        key={editingId ?? 'new'}
        show={showModal}
        title={modalTitle}
        initialValues={initialValues}
        onClose={closeModal}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}

export default OrderListPage;
