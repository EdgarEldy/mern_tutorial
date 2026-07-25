import { useState } from 'react';
import useCategories from '../hooks/useCategories';
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '../services/category.service';
import CategoryTable from '../components/CategoryTable';
import CategoryModal from '../components/CategoryModal';

function CategoryListPage() {
  const { categories, loading, error, refetch } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [initialValues, setInitialValues] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setInitialValues(null);
    setModalTitle('New Category');
    setShowModal(true);
  };

  const openEdit = async (id) => {
    try {
      const res = await getCategoryById(id);
      setEditingId(id);
      setInitialValues(res.data.data);
      setModalTitle('Edit Category');
      setShowModal(true);
    } catch {
      alert('Failed to load category');
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
        await updateCategory(editingId, data);
      } else {
        await createCategory(data);
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
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message ?? 'Delete failed');
    }
  };

  if (loading) return <p className="p-3">Loading...</p>;
  if (error) return <p className="p-3 text-danger">{error}</p>;

  return (
    <div className="container-fluid">
      <CategoryTable
        categories={categories}
        onNew={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
      <CategoryModal
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

export default CategoryListPage;
