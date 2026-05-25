import type { IngredientType } from '../../../shared/types';

export interface SavedBurger {
  id: string;
  name: string;
  emoji: string;
  ingredients: IngredientType[];
  createdAt: string;
}

export const FREE_STORAGE_KEY = 'burger-block-free-burgers';

export function loadSaved(): SavedBurger[] {
  try { return JSON.parse(localStorage.getItem(FREE_STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}
