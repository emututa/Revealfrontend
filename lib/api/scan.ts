




// ============================================
// lib/api/scan.ts - Food Scan Endpoints (FIXED)
// ============================================
import api from './index';

/** Data type for image scan */
export interface ScanWithImageData {
  image: string; // local file URI (expo-camera / image picker)
  foodName?: string; // ADD THIS - backend expects it
  userId?: string; // optional if backend needs auth
}

/** Data type for text scan */
export interface ScanWithTextData {
  ingredients: string; // CHANGED from 'text' to 'ingredients'
  foodName?: string;
  userId?: string;
}

/** Backend response structure */
export interface ScanResult {
  foodName: string;
  ingredients: string;
  isSafe: boolean;
  riskLevel: 'safe' | 'caution' | 'danger';
  warnings: string[];
  explanation: string;
}

export const scanAPI = {
  /**
   * POST /api/scan/image
   * Sends an image as FormData to the backend for analysis
   */
  scanWithImage: async (data: ScanWithImageData): Promise<ScanResult> => {
    const formData = new FormData();

    if (!data.image) {
      throw new Error('No image provided');
    }

    // Convert URI to FormData file
    const uri = data.image;
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri,
      name: filename,
      type,
    } as any);

    // Backend expects foodName in the body
    if (data.foodName) {
      formData.append('foodName', data.foodName);
    }

    // Optional userId for authenticated scans
    if (data.userId) {
      formData.append('userId', data.userId);
    }

    const response = await api.post('/scan/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * POST /api/scan/text
   * Sends ingredients as text for analysis
   */
  scanWithText: async (data: ScanWithTextData): Promise<ScanResult> => {
    if (!data.ingredients) throw new Error('No ingredients provided');

    const response = await api.post('/scan/text', {
      ingredients: data.ingredients,
      foodName: data.foodName || 'Unknown Food',
      userId: data.userId || undefined,
    });

    return response.data;
  },

  /**
   * GET /api/scan/history
   * Returns the list of previous scans
   */
  getHistory: async () => {
    const response = await api.get('/scan/history');
    return response.data;
  },

  /**
   * GET /api/scan/:id
   * Get a single scan result by ID
   */
  getScanById: async (id: string) => {
    if (!id) throw new Error('Scan ID is required');
    const response = await api.get(`/scan/${id}`);
    return response.data;
  },
};