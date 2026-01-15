

// ============================================
// lib/api/health-check.ts - Health Check
// ============================================
import api from './index';

export const healthCheckAPI = {
  // GET /health
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },

  // GET /api
  getApiDocs: async () => {
    const response = await api.get('/');
    return response.data;
  },
};