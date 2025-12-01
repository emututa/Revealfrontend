// Mock authentication for demo purposes
export const mockAuth = {
  signInWithEmail: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'demo@example.com' && password === 'password') {
      return { user: { id: '1', email, displayName: 'Demo User' } };
    }
    throw new Error('Invalid credentials');
  },
  signUp: async (data: any) => {
    // Simulate signup
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { user: { id: '1', email: data.email, displayName: data.displayName } };
  },
  me: async () => {
    return { id: '1', email: 'demo@example.com', displayName: 'Demo User' };
  },
  logout: async () => {
    // Simulate logout
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};

export const mockDb = {
  healthProfiles: {
    list: async (options?: any) => {
      // Mock data
      return [{
        id: 'profile_1',
        userId: '1',
        allergies: JSON.stringify(['Peanuts', 'Shellfish']),
        healthComplications: JSON.stringify(['Diabetes']),
        pastReactions: JSON.stringify(['Severe allergic reaction']),
        medicalNotes: 'Monitor blood sugar levels',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }];
    },
    create: async (data: any) => {
      console.log('Mock: Created health profile', data);
      return data;
    }
  },
  foodChecks: {
    list: async (options?: any) => {
      // Mock recent checks
      return [
        {
          id: 'check_1',
          userId: '1',
          foodName: 'Peanut Butter Sandwich',
          ingredients: 'bread, peanut butter, jelly',
          isSafe: '0',
          warningIngredients: JSON.stringify(['Peanuts']),
          alternatives: JSON.stringify(['Use almond butter instead']),
          checkedAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 'check_2',
          userId: '1',
          foodName: 'Greek Salad',
          ingredients: 'lettuce, tomatoes, feta, olives',
          isSafe: '1',
          warningIngredients: JSON.stringify([]),
          alternatives: JSON.stringify([]),
          checkedAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
        }
      ];
    },
    create: async (data: any) => {
      console.log('Mock: Created food check', data);
      return data;
    }
  }
};

export const mockStorage = {
  upload: async (file: File, path: string) => {
    console.log('Mock: Uploaded file to', path);
    return { publicUrl: `https://mock-storage.com/${path}` };
  }
};

export const mockAi = {
  generateText: async (options: any) => {
    return { text: 'Mock extracted ingredients: sugar, flour, eggs, milk' };
  },
  generateObject: async (options: any) => {
    return {
      object: {
        isSafe: Math.random() > 0.5,
        warningIngredients: ['Mock ingredient'],
        alternatives: ['Mock alternative'],
        analysis: 'Mock analysis result'
      }
    };
  }
};