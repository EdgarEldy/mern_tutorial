import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, getCategoryById, updateCategory } from '../services/category.service';
import CategoryForm from '../components/CategoryForm';

function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCategoryById(id)
      .then((res) => setInitialValues(res.data.data))
      .catch(() => navigate('/categories'));
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      if (id) {
        await updateCategory(id, data);
      } else {
        await createCategory(data);
      }
      navigate('/categories');
    } catch (err) {
      alert(err.response?.data?.message ?? 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (id && !initialValues) return <p className="p-3">Loading...</p>;

  return (
    <div className="container-fluid">
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            {id ? 'Edit Category' : 'New Category'}
          </h6>
        </div>
        <div className="card-body">
          <CategoryForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default CategoryFormPage;
