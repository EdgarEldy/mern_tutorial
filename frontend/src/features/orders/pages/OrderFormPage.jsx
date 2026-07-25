import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createOrder, getOrderById, updateOrder } from '../services/order.service';
import OrderForm from '../components/OrderForm';

function OrderFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then((res) => setInitialValues(res.data.data))
      .catch(() => navigate('/orders'));
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      if (id) {
        await updateOrder(id, data);
      } else {
        await createOrder(data);
      }
      navigate('/orders');
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
            {id ? 'Edit Order' : 'New Order'}
          </h6>
        </div>
        <div className="card-body">
          <OrderForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderFormPage;
