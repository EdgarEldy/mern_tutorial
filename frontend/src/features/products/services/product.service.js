import axiosInstance from '../../../lib/axios';

export const getProducts = () => axiosInstance.get('/products');
export const getProductById = (id) => axiosInstance.get(`/products/${id}`);
export const createProduct = (data) => axiosInstance.post('/products', data);
export const updateProduct = (id, data) => axiosInstance.put(`/products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);
