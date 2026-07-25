import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCustomer, getCustomerById, updateCustomer } from '../services/customer.service';
import CustomerForm from '../components/CustomerForm';

function CustomerFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getCustomerById(id)
      .then((res) => setInitialValues(res.data.data))
      .catch(() => navigate('/customers'));
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      if (id) {
        await updateCustomer(id, data);
      } else {
        await createCustomer(data);
      }
      navigate('/customers');
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
            {id ? 'Edit Customer' : 'New Customer'}
          </h6>
        </div>
        <div className="card-body">
          <CustomerForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerFormPage;
