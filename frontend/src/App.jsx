import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DefaultLayout from './components/layouts/DefaultLayout';
import Dashboard from './pages/Dashboard';
import { CategoryListPage, CategoryFormPage } from './features/categories';
import { ProductListPage, ProductFormPage } from './features/products';
import { CustomerListPage, CustomerFormPage } from './features/customers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<CategoryListPage />} />
          <Route path="categories/new" element={<CategoryFormPage />} />
          <Route path="categories/:id/edit" element={<CategoryFormPage />} />
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id/edit" element={<ProductFormPage />} />
          <Route path="customers" element={<CustomerListPage />} />
          <Route path="customers/new" element={<CustomerFormPage />} />
          <Route path="customers/:id/edit" element={<CustomerFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
