// Type definitions for Reveal app

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  hasCompletedOnboarding: string; // "0" or "1"
}

export interface HealthProfile {
  id: string;
  userId: string;
  healthComplications: string; // JSON stringified array
  allergies: string; // JSON stringified array
  pastReactions: string; // JSON stringified array
  medicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodCheck {
  id: string;
  userId: string;
  foodName: string;
  ingredients: string; // JSON stringified array or text
  isSafe: string; // "0" or "1"
  warningIngredients?: string; // JSON stringified array
  alternatives?: string; // JSON stringified array
  checkedAt: string;
  imageUrl?: string;
}

export interface AnalysisResult {
  isSafe: boolean;
  warningIngredients: string[];
  alternatives?: string[];
  analysis: string;
}
