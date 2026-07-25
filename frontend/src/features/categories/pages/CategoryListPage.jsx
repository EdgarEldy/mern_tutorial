import useCategories from '../hooks/useCategories';
import { deleteCategory } from '../services/category.service';
import CategoryTable from '../components/CategoryTable';

function CategoryListPage() {
  const { categories, loading, error, refetch } = useCategories();

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
      <CategoryTable categories={categories} onDelete={handleDelete} />
    </div>
  );
}

export default CategoryListPage;
