import api from './api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const authService = {
  login: (data: LoginRequest) => api.post<any, LoginResponse>('/admin/login', data),
  logout: () => {
    localStorage.removeItem('token');
  },
};
