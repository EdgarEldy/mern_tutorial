import { useState } from 'react';
import useCustomers from '../hooks/useCustomers';
import {
  createCustomer,
  deleteCustomer,
  getCustomerById,
  updateCustomer,
} from '../services/customer.service';
import CustomerTable from '../components/CustomerTable';
import CustomerModal from '../components/CustomerModal';

function CustomerListPage() {
  const { customers, loading, error, refetch } = useCustomers();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setInitialValues(null);
    setModalTitle('New Customer');
    setShowModal(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await getCustomerById(id);
      setEditingId(id);
      setInitialValues(res.data.data);
      setModalTitle('Edit Customer');
      setShowModal(true);
    } catch {
      alert('Failed to load customer');
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
        await updateCustomer(editingId, data);
      } else {
        await createCustomer(data);
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
      <CustomerTable
        customers={customers}
        onNew={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <CustomerModal
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

export default CustomerListPage;
