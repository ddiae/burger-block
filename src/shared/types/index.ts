export type IngredientType =
  | 'bottom_bun'
  | 'top_bun'
  | 'patty'
  | 'cheese'
  | 'lettuce'
  | 'tomato'
  | 'onion'
  | 'bulgogi_sauce'
  | 'ketchup'
  | 'special_sauce'
  | 'bacon'
  | 'egg';

export interface IngredientRule {
  type: IngredientType;
  mustBeAfter?: IngredientType[];
  mustBeBefore?: IngredientType[];
  requiresBefore?: IngredientType;
}

export interface BurgerRecipe {
  id: string;
  name: string;
  emoji: string;
  description: string;
  sequence: IngredientType[];
  availableIngredients: IngredientType[];
  rules: IngredientRule[];
  isDebug?: boolean;
  initialSequence?: IngredientType[]; // 디버그 스테이지: 미리 잘못 배치된 블록
}

export type FeedbackType = 'missing' | 'wrong_order' | 'unnecessary';

export interface Feedback {
  type: FeedbackType;
  position: number;
  expected?: IngredientType;
  got?: IngredientType;
  message: string;
}

export type Mode = 'real' | 'coding';

export interface PlacedItem {
  id: string;
  type: IngredientType;
}
