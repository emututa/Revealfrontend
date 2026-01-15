

// // ============================================
// // lib/api/auth.ts - Auth Endpoints
// // ============================================
// import api from './index';

// export interface RegisterData {
//   email: string;
//   password: string;
//   displayName?: string;
//   name?: string;
// }

// export interface LoginData {
//   email: string;
//   password: string;
// }

// export const authAPI = {
//   // POST /api/auth/register
//   register: async (data: RegisterData) => {
//     const response = await api.post('/auth/register', data);
//     return response.data;
//   },

//   // POST /api/auth/login
//   login: async (data: LoginData) => {
//     const response = await api.post('/auth/login', data);
//     return response.data;
//   },

//   // POST /api/auth/logout
//   logout: async () => {
//     const response = await api.post('/auth/logout');
//     return response.data;
//   },

//   // GET /api/auth/me (if you have this endpoint)
//   me: async () => {
//     const response = await api.get('/auth/me');
//     return response.data;
//   },
// };




// ============================================
// lib/api/auth.ts - Auth Endpoints
// ============================================
import api from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const authAPI = {
  // POST /api/auth/register
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // POST /api/auth/login
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // POST /api/auth/logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    await AsyncStorage.removeItem('token');
    return response.data;
  },

  // GET /api/auth/me
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};