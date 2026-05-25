import { useState, useEffect } from 'react';
import type { IngredientType, BurgerRecipe } from '../../../shared/types';
import { validate } from '../../../shared/lib/validator';

const STEP_MS = 700;

export interface UseExecutionResult {
  isRunning: boolean;
  runningIndex: number;
  animatedPlaced: IngredientType[];
  currentIngredient: IngredientType | null;
  handleRun: () => void;
  handleReset: () => void;
}

export function useExecution(placed: IngredientType[], recipe: BurgerRecipe): UseExecutionResult & {
  isCorrect: boolean;
  showFeedback: boolean;
  feedback: ReturnType<typeof validate>['feedback'];
  handleRetry: () => void;
  handleNext: (onNext: () => void) => void;
} {
  const [isRunning, setIsRunning] = useState(false);
  const [runningIndex, setRunningIndex] = useState(-1);
  const [animatedPlaced, setAnimatedPlaced] = useState<IngredientType[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<IngredientType | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<ReturnType<typeof validate>['feedback']>(null);

  useEffect(() => {
    if (!isRunning) return;
    if (runningIndex >= placed.length) {
      const t = setTimeout(() => {
        setCurrentIngredient(null);
        setIsRunning(false);
        setRunningIndex(-1);
        const result = validate(placed, recipe);
        setIsCorrect(result.isCorrect);
        setFeedback(result.feedback);
        setShowFeedback(true);
      }, STEP_MS);
      return () => clearTimeout(t);
    }
    // 재료 추가와 텍스트를 동시에 (120ms)
    const t1 = setTimeout(() => {
      setAnimatedPlaced(prev => [...prev, placed[runningIndex]]);
      setCurrentIngredient(placed[runningIndex]);
    }, 120);
    const t2 = setTimeout(() => {
      setRunningIndex(prev => prev + 1);
    }, STEP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isRunning, runningIndex, placed, recipe]);

  const handleRun = () => {
    if (placed.length === 0 || isRunning) return;
    setAnimatedPlaced([]);
    setCurrentIngredient(null);
    setRunningIndex(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setShowFeedback(false);
    setFeedback(null);
    setIsCorrect(false);
    setIsRunning(false);
    setRunningIndex(-1);
    setAnimatedPlaced([]);
    setCurrentIngredient(null);
  };

  const handleRetry = () => {
    setShowFeedback(false);
    setFeedback(null);
    setIsCorrect(false);
    setAnimatedPlaced([]);
    setCurrentIngredient(null);
  };

  const handleNext = (onNext: () => void) => {
    setShowFeedback(false);
    setFeedback(null);
    setIsCorrect(false);
    setAnimatedPlaced([]);
    setCurrentIngredient(null);
    onNext();
  };

  return {
    isRunning,
    runningIndex,
    animatedPlaced,
    currentIngredient,
    handleRun,
    handleReset,
    isCorrect,
    showFeedback,
    feedback,
    handleRetry,
    handleNext,
  };
}
