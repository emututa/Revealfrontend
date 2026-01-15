// ============================================
// lib/auth.ts - Authentication Helper
// ============================================
import api from './api/index';
import { useUserStore } from './stores/userStore';

export const auth = {
  signInWithEmail: async (email: string, password: string) => {
    try {
      // Call your backend login API
      const response = await api.post('/auth/login', { email, password });
      
      // Response should be: { success: true, user: {...}, token: "..." }
      const { user, token } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      // Store in zustand (auto-saves to AsyncStorage)
      useUserStore.getState().login(user, token);
      
      return { user };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  },

  signUp: async (data: { email: string; password: string; displayName: string }) => {
    try {
      // Call your backend register API
      // Try different field name combinations
      const response = await api.post('/auth/register', {
        email: data.email,
        password: data.password,
        name: data.displayName, // Most Sequelize backends use 'name'
        // displayName: data.displayName, // Uncomment if your backend uses this
      });
      
      // Response should be: { success: true, user: {...}, token: "..." }
      const { user, token } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      // Store in zustand (auto-saves to AsyncStorage)
      useUserStore.getState().login(user, token);
      
      return { user };
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      throw new Error(message);
    }
  },

  logout: async () => {
    try {
      // Call backend logout endpoint
      await api.post('/auth/logout');
    } catch (error) {
      console.log('Logout API failed, but clearing local data');
    } finally {
      // Always clear local data
      useUserStore.getState().logout();
    }
  },

  me: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data.user || response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  },

  // Check if user is authenticated on app startup
  checkAuth: async () => {
    const { token, isAuthenticated } = useUserStore.getState();
    
    if (!token || !isAuthenticated) {
      return false;
    }

    try {
      // Verify token is still valid
      await auth.me();
      return true;
    } catch (error) {
      // Token expired or invalid
      useUserStore.getState().logout();
      return false;
    }
  },
};





// // ============================================
// // lib/auth.ts - Authentication Helper
// // ============================================
// import { authAPI } from './api/auth';
// import { useUserStore } from './stores/userStore';

// export const auth = {
//   signInWithEmail: async (email: string, password: string) => {
//     try {
//       const response = await authAPI.login({ email, password });
      
//       // Response: { user, token } or { success, user, token }
//       const { user, token } = response;
      
//       if (!token || !user) {
//         throw new Error('Invalid response from server');
//       }
      
//       // Store in zustand
//       useUserStore.getState().login(user, token);
      
//       return { user };
//     } catch (error: any) {
//       const message = error.response?.data?.message || error.message || 'Login failed';
//       throw new Error(message);
//     }
//   },

//   signUp: async (data: { email: string; password: string; displayName: string }) => {
//     try {
//       const response = await authAPI.register({
//         email: data.email,
//         password: data.password,
//         displayName: data.displayName,
//         name: data.displayName,
//       });
      
//       // Response: { user, token } or { success, user, token }
//       const { user, token } = response;
      
//       if (!token || !user) {
//         throw new Error('Invalid response from server');
//       }
      
//       // Store in zustand
//       useUserStore.getState().login(user, token);
      
//       return { user };
//     } catch (error: any) {
//       const message = error.response?.data?.message || error.message || 'Signup failed';
//       throw new Error(message);
//     }
//   },

//   logout: async () => {
//     try {
//       await authAPI.logout();
//       useUserStore.getState().logout();
//     } catch (error) {
//       // Logout locally even if API fails
//       useUserStore.getState().logout();
//     }
//   },

//   me: async () => {
//     try {
//       const response = await authAPI.me();
//       return response.user || response;
//     } catch (error: any) {
//       throw new Error(error.response?.data?.message || 'Failed to get user');
//     }
//   },
// };










// // // Mock authentication for demo purposes
// // export const mockAuth = {
// //   signInWithEmail: async (email: string, password: string) => {
// //     // Simulate API call
// //     await new Promise(resolve => setTimeout(resolve, 1000));
// //     if (email === 'demo@example.com' && password === 'password') {
// //       return { user: { id: '1', email, displayName: 'Demo User' } };
// //     }
// //     throw new Error('Invalid credentials');
// //   },
// //   signUp: async (data: any) => {
// //     // Simulate signup
// //     await new Promise(resolve => setTimeout(resolve, 1000));
// //     return { user: { id: '1', email: data.email, displayName: data.displayName } };
// //   },
// //   me: async () => {
// //     return { id: '1', email: 'demo@example.com', displayName: 'Demo User' };
// //   },
// //   logout: async () => {
// //     // Simulate logout
// //     await new Promise(resolve => setTimeout(resolve, 500));
// //   }
// // };

// // export const mockDb = {
// //   healthProfiles: {
// //     list: async (options?: any) => {
// //       // Mock data
// //       return [{
// //         id: 'profile_1',
// //         userId: '1',
// //         allergies: JSON.stringify(['Peanuts', 'Shellfish']),
// //         healthComplications: JSON.stringify(['Diabetes']),
// //         pastReactions: JSON.stringify(['Severe allergic reaction']),
// //         medicalNotes: 'Monitor blood sugar levels',
// //         createdAt: new Date().toISOString(),
// //         updatedAt: new Date().toISOString()
// //       }];
// //     },
// //     create: async (data: any) => {
// //       console.log('Mock: Created health profile', data);
// //       return data;
// //     }
// //   },
// //   foodChecks: {
// //     list: async (options?: any) => {
// //       // Mock recent checks
// //       return [
// //         {
// //           id: 'check_1',
// //           userId: '1',
// //           foodName: 'Peanut Butter Sandwich',
// //           ingredients: 'bread, peanut butter, jelly',
// //           isSafe: '0',
// //           warningIngredients: JSON.stringify(['Peanuts']),
// //           alternatives: JSON.stringify(['Use almond butter instead']),
// //           checkedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
// //         },
// //         {
// //           id: 'check_2',
// //           userId: '1',
// //           foodName: 'Greek Salad',
// //           ingredients: 'lettuce, tomatoes, feta, olives',
// //           isSafe: '1',
// //           warningIngredients: JSON.stringify([]),
// //           alternatives: JSON.stringify([]),
// //           checkedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
// //         }
// //       ];
// //     },
// //     create: async (data: any) => {
// //       console.log('Mock: Created food check', data);
// //       return data;
// //     }
// //   }
// // };

// // export const mockStorage = {
// //   upload: async (file: File, path: string) => {
// //     console.log('Mock: Uploaded file to', path);
// //     return { publicUrl: `https://mock-storage.com/${path}` };
// //   }
// // };

// // export const mockAi = {
// //   generateText: async (options: any) => {
// //     return { text: 'Mock extracted ingredients: sugar, flour, eggs, milk' };
// //   },
// //   generateObject: async (options: any) => {
// //     return {
// //       object: {
// //         isSafe: Math.random() > 0.5,
// //         warningIngredients: ['Mock ingredient'],
// //         alternatives: ['Mock alternative'],
// //         analysis: 'Mock analysis result'
// //       }
// //     };
// //   }
// // };