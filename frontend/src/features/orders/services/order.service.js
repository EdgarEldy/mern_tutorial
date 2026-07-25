import axiosInstance from '../../../lib/axios';

export const getOrders = () => axiosInstance.get('/orders');
export const getOrderById = (id) => axiosInstance.get(`/orders/${id}`);
export const createOrder = (data) => axiosInstance.post('/orders', data);
export const updateOrder = (id, data) => axiosInstance.put(`/orders/${id}`, data);
export const deleteOrder = (id) => axiosInstance.delete(`/orders/${id}`);
