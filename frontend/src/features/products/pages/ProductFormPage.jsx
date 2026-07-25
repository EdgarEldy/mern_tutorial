import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../services/product.service';
import ProductForm from '../components/ProductForm';

function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getProductById(id)
      .then((res) => setInitialValues(res.data.data))
      .catch(() => navigate('/products'));
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      if (id) {
        await updateProduct(id, data);
      } else {
        await createProduct(data);
      }
      navigate('/products');
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
            {id ? 'Edit Product' : 'New Product'}
          </h6>
        </div>
        <div className="card-body">
          <ProductForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductFormPage;
