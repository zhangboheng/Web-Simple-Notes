import axios from 'axios';
import qs from 'qs';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    if (config.method === 'get') {
      config.headers['Content-Type'] = 'application/json';
    } else if (config.method === 'post') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.data = qs.stringify(config.data);
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default instance;