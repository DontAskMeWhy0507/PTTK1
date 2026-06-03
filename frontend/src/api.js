import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => { if (err.response?.status === 401) localStorage.removeItem('token'); return Promise.reject(err); }
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const getUsers = () => api.get('/auth/users');
export const adminUpdateUser = (id, data) => api.patch(`/auth/users/${id}`, data);
export const updateUserRole = (id, data) => api.patch(`/auth/users/${id}/role`, data);
export const getTransactionLogs = () => api.get('/contracts/transactions');

export const getProperties = (params) => api.get('/properties', { params });
export const getAvailableForBrokers = () => api.get('/properties/broker/available');
export const getBrokerManagedProperties = () => api.get('/properties/broker/managed');
export const getPropertyDetail = (id) => api.get(`/properties/${id}`);
export const createDepositRequest = (data) => api.post('/properties/deposit-request', data);
export const customerPayDeposit = (contractId) => api.post(`/properties/customer-pay-deposit/${contractId}`);
export const staffSignContract = (contractId) => api.post(`/properties/staff-sign-contract/${contractId}`);
export const claimProperty = (id) => api.post(`/properties/${id}/claim`);

export const getMyContracts = () => api.get(`/contracts/deposit?_t=${Date.now()}`);
export const cancelDepositContract = (id, data = {}) => api.post(`/contracts/deposit/${id}/cancel`, data);
export const getMyRentalContracts = () => api.get('/contracts/rental/my');
export const getRentalContractDetail = (id) => api.get(`/contracts/rental/${id}`);
export const payRent = (id) => api.post(`/contracts/rental/${id}/pay`);
export const listContractDocuments = (type, id) => api.get(`/contracts/${type}/${id}/documents`);
export const uploadContractDocument = (type, id, data) => api.post(`/contracts/${type}/${id}/documents`, data);
export const downloadContractDocument = (documentId) => api.get(`/contracts/documents/${documentId}`);
export const getAppointments = () => api.get('/employee/appointments');
export const createRentalContract = (data) => api.post('/employee/contracts/rental', data);
export const getCommissions = () => api.get('/employee/commissions');
export const getClosedRentalContracts = () => api.get('/employee/contracts/rental');
export const getInteractions = () => api.get('/employee/interactions');
export const logInteraction = (data) => api.post('/employee/interactions', data);
export const updatePropertyReview = (id, data) => api.patch(`/employee/properties/${id}/review`, data);
export const createAppointment = (data) => api.post('/appointments', data);
export const updateAppointment = (id, data) => api.patch(`/appointments/${id}`, data);

export default api;
