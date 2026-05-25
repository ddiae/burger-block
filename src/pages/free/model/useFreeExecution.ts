import { useState, useEffect } from 'react';
import type { IngredientType } from '../../../shared/types';

const STEP_MS = 700;

export function useFreeExecution(placed: IngredientType[]) {
  const [isRunning, setIsRunning] = useState(false);
  const [runningIndex, setRunningIndex] = useState(-1);
  const [animatedPlaced, setAnimatedPlaced] = useState<IngredientType[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<IngredientType | null>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    if (runningIndex >= placed.length) {
      const t = setTimeout(() => {
        setCurrentIngredient(null);
        setIsRunning(false);
        setRunningIndex(-1);
        setIsDone(true);
      }, STEP_MS);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => {
      setAnimatedPlaced(prev => [...prev, placed[runningIndex]]);
      setCurrentIngredient(placed[runningIndex]);
    }, 120);
    const t2 = setTimeout(() => setRunningIndex(prev => prev + 1), STEP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isRunning, runningIndex, placed]);

  const handleRun = () => {
    if (placed.length === 0 || isRunning) return;
    setAnimatedPlaced([]);
    setCurrentIngredient(null);
    setIsDone(false);
    setRunningIndex(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRunningIndex(-1);
    setAnimatedPlaced([]);
    setCurrentIngredient(null);
    setIsDone(false);
  };

  return { isRunning, runningIndex, animatedPlaced, isDone, currentIngredient, handleRun, handleReset };
}
