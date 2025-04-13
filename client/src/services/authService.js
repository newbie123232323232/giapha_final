import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = (data) => axios.post(`${API_URL}/register`, data);

export const login = (data) => axios.post(`${API_URL}/login`, data);

export const changePassword = (data, token) =>
  axios.put(`${API_URL}/change-password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteAccount = (token) =>
  axios.delete(`${API_URL}/delete-account`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 🟡 Hàm mới: Lấy thông tin người dùng hiện tại
export const getUserProfile = (token) =>
  axios
    .get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => res.data);

export const updateProfile = (data, token) =>
  axios.put(`${API_URL}/update-profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
