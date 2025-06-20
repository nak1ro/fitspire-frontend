import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:5016/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

