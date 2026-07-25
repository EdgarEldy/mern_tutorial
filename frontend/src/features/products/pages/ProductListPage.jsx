import { useState } from 'react';
import useProducts from '../hooks/useProducts';
import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from '../services/product.service';
import ProductTable from '../components/ProductTable';
import ProductModal from '../components/ProductModal';

function ProductListPage() {
  const { products, loading, error, refetch } = useProducts();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setInitialValues(null);
    setModalTitle('New Product');
    setShowModal(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await getProductById(id);
      setEditingId(id);
      setInitialValues(res.data.data);
      setModalTitle('Edit Product');
      setShowModal(true);
    } catch {
      alert('Failed to load product');
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
        await updateProduct(editingId, data);
      } else {
        await createProduct(data);
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
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Delete failed');
    }
  };

  if (loading) return <p className="p-3">Loading...</p>;
  if (error) return <p className="p-3 text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <ProductTable
        products={products}
        onNew={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <ProductModal
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

export default ProductListPage;
