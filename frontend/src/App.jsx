import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from './components/layouts/DefaultLayout';
import Dashboard from './pages/Dashboard';
import { CategoryListPage } from './features/categories';
import { ProductListPage } from './features/products';
import { CustomerListPage } from './features/customers';
import { OrderListPage } from './features/orders';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="orders" element={<OrderListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
