import { useState, useEffect } from 'react';
import type { IngredientType } from '../../../shared/types';

const STEP_MS = 700;

export function useBurgerReplay() {
  const [replayIngredients, setReplayIngredients] = useState<IngredientType[] | null>(null);
  const [replayIdx, setReplayIdx] = useState(-1);
  const [replayPlaced, setReplayPlaced] = useState<IngredientType[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState<IngredientType | null>(null);

  useEffect(() => {
    if (!isReplaying || !replayIngredients) return;
    if (replayIdx >= replayIngredients.length) {
      const t = setTimeout(() => { setIsReplaying(false); setReplayIdx(-1); setCurrentIngredient(null); }, STEP_MS);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => {
      setReplayPlaced(prev => [...prev, replayIngredients[replayIdx]]);
      setCurrentIngredient(replayIngredients[replayIdx]);
    }, 120);
    const t2 = setTimeout(() => setReplayIdx(p => p + 1), STEP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isReplaying, replayIdx, replayIngredients]);

  const startReplay = (ingredients: IngredientType[]) => {
    setReplayIngredients(ingredients);
    setReplayPlaced([]);
    setCurrentIngredient(null);
    setReplayIdx(0);
    setIsReplaying(true);
  };

  const stopReplay = () => {
    setIsReplaying(false);
    setReplayIdx(-1);
    setReplayPlaced([]);
    setCurrentIngredient(null);
    setReplayIngredients(null);
  };

  return { isReplaying, replayPlaced, currentIngredient, startReplay, stopReplay };
}
