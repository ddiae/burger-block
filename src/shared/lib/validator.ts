import type { BurgerRecipe, Feedback, IngredientType } from '../types';
import { INGREDIENT_LABELS } from '../../entities/burger/data/burgers';
import { josa } from './josa';

export const validate = (
  placed: IngredientType[],
  recipe: BurgerRecipe
): { isCorrect: boolean; feedback: Feedback | null } => {
  const expected = recipe.sequence;

  if (placed.length === expected.length && placed.every((ing, i) => ing === expected[i])) {
    return { isCorrect: true, feedback: null };
  }

  for (let i = 0; i < Math.max(placed.length, expected.length); i++) {
    const p = placed[i];
    const e = expected[i];

    if (!p && e) {
      return {
        isCorrect: false,
        feedback: {
          type: 'missing',
          position: i,
          expected: e,
          message: `${INGREDIENT_LABELS[e]}${josa(INGREDIENT_LABELS[e], '을/를')} 빼먹은 것 같아요! 다시 생각해 보세요!`,
        },
      };
    }

    if (p && !e) {
      return {
        isCorrect: false,
        feedback: {
          type: 'unnecessary',
          position: i,
          got: p,
          message: `이 재료(${INGREDIENT_LABELS[p]})는 이 버거에 필요없어요!`,
        },
      };
    }

    if (p !== e) {
      if (!recipe.sequence.includes(p)) {
        return {
          isCorrect: false,
          feedback: {
            type: 'unnecessary',
            position: i,
            got: p,
            expected: e,
            message: `이 재료(${INGREDIENT_LABELS[p]})는 이 버거에 필요없어요!`,
          },
        };
      }
      return {
        isCorrect: false,
        feedback: {
          type: 'wrong_order',
          position: i,
          expected: e,
          got: p,
          message: `${INGREDIENT_LABELS[p]}${josa(INGREDIENT_LABELS[p], '이/가')} 잘못된 위치에 들어갔어요!`,
        },
      };
    }
  }

  return { isCorrect: false, feedback: { type: 'missing', position: 0, message: '다시 확인해 보세요!' } };
};
