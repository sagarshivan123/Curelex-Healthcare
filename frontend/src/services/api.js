import axios from 'axios';

const API_URL = 'http://localhost:4000/api'||process.env.REACT_APP_API_URL ;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Patient Authentication
export const patientSignup = async (patientData) => {
  const response = await api.post('/auth/patient/signup', patientData);
  return response.data;
};

export const patientSignin = async (credentials) => {
  const response = await api.post('/auth/patient/signin', credentials);
  return response.data;
};

export const patientForgotPassword = async (email) => {
  const response = await api.post('/auth/patient/forgot-password', { email });
  return response.data;
};

export const getPatientDashboard = async () => {
  const response = await api.get('/patient/dashboard');
  return response.data;
};

export const getPatientProfile = async () => {
  const response = await api.get('/patient/profile');
  return response.data;
};

// Doctor Authentication
export const doctorSignup = async (formData) => {
  const response = await axios.post(`${API_URL}/auth/doctor/signup`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const doctorSignin = async (credentials) => {
  const response = await api.post('/auth/doctor/signin', credentials);
  return response.data;
};

export const getDoctorProfile = async () => {
  const response = await api.get('/doctor/profile');
  return response.data;
};

export default api;