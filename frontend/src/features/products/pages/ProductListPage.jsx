import useProducts from '../hooks/useProducts';
import { deleteProduct } from '../services/product.service';
import ProductTable from '../components/ProductTable';

function ProductListPage() {
  const { products, loading, error, refetch } = useProducts();

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
      <ProductTable products={products} onDelete={handleDelete} />
    </div>
  );
}

export default ProductListPage;
