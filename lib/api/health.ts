// ============================================
// lib/api/health.ts - Health Data Endpoints
// ============================================

import api from "./index";



export const healthAPI = {
  // GET /api/health-data
  getHealthData: async () => {
    const response = await api.get("/health-data");
    return response.data;
  },

  // POST /api/health-conditions
  updateConditions: async (conditions: string[]) => {
    const response = await api.post("/health-conditions", {
      conditions,
    });
    return response.data;
  },

  // POST /api/allergic-foods
  updateAllergies: async (foods: string[]) => {
    const response = await api.post("/allergic-foods", {
      foods,
    });
    return response.data;
  },

  // POST /api/food-reactions
  updateReactions: async (
    reactions: { foodName: string; medicalNotes?: string }[]
  ) => {
    const response = await api.post("/food-reactions", {
      reactions,
    });
    return response.data;
  },
};


