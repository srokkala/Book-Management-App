import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

export const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export const register = async (name, email, password) => {
  try {
    const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { msg: 'Server connection error' };
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { msg: 'Server connection error' };
  }
};

export const loadUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/auth`);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { msg: 'Server connection error' };
  }
};

export const getBooks = async () => {
  try {
    const res = await axios.get(`${API_URL}/books`);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { msg: 'Server connection error' };
  }
};

export const addBook = async (bookData) => {
  try {
    const res = await axios.post(`${API_URL}/books`, bookData);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { msg: 'Server connection error' };
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const res = await axios.put(`${API_URL}/books/${id}`, bookData);
    return res.data;
  } catch (err) {
    throw err.response ? err.response.data : { msg: 'Server connection error' };
  }
};

export const deleteBook = async (id) => {
  try {
    await axios.delete(`${API_URL}/books/${id}`);
    return id;
  } catch (err) {
    throw err.response ? err.response.data : { msg: 'Server connection error' };
  }
};