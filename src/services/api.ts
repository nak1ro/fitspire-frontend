import axios from 'axios';

const API_BASE_URL = 'http://loacalhost:5016/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

