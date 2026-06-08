import axios from 'axios';
import { API_BASE } from '../config/constants';

export const apiService = {
  getOrder: (id) => axios.get(`${API_BASE}/orders/${id}`),
  createOrder: (formData) => axios.post(`${API_BASE}/orders`, formData),
  reuploadSlip: (id, formData) => axios.put(`${API_BASE}/orders/${id}/slip`, formData),
  adminLogin: (password) => axios.post(`${API_BASE}/login`, { password }),
  getAdminOrders: (token) => axios.get(`${API_BASE}/admin/orders`, { headers: { Authorization: token } }),
  updateOrderStatus: (id, newStatus, token) => axios.put(`${API_BASE}/orders/${id}/status`, { newStatus }, { headers: { Authorization: token } }),
  deleteOrder: (id, token) => axios.delete(`${API_BASE}/orders/${id}`, { headers: { Authorization: token } })
};