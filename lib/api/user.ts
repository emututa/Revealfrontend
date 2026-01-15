
// ============================================
// lib/api/user.ts - User Profile Endpoints
// ============================================
import api from './index';

export interface UpdateProfileData {
  displayName?: string;
  name?: string;
  email?: string;
  phone?: string;
  [key: string]: any;
}

export const userAPI = {
  // GET /api/user/profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // PUT /api/user/profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },
};
