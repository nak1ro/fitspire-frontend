import { api } from '../../services/api';

export const register = async (
  email: string,
  username: string,
  password: string
) => {
  const res = await api.post('/account/register', {
    email,
    userName: username,
    password,
  });
  return res.data;
};

export const login = async (login: string, password: string) => {
  const res = await api.post('/account/login', {
    login,
    password,
  });
  return res.data;
};

export const googleLogin = async (idToken: string) => {
  const res = await api.post('/account/external-login', {
    provider: 'Google',
    idToken,
  });
  return res.data;
};
