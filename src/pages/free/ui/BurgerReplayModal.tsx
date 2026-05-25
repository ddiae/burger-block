import { useEffect } from 'react';
import type { SavedBurger } from '../model/types';
import { INGREDIENT_LABELS } from '../../../entities/burger/data/burgers';
import { useBurgerReplay } from '../model/useBurgerReplay';
import IngredientSVG from '../../../entities/burger/ui/IngredientSVG';

interface BurgerReplayModalProps {
  burger: SavedBurger;
  onClose: () => void;
}

export default function BurgerReplayModal({ burger, onClose }: BurgerReplayModalProps) {
  const { isReplaying, replayPlaced, currentIngredient, startReplay, stopReplay } = useBurgerReplay();

  useEffect(() => {
    startReplay(burger.ingredients);
    return () => stopReplay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    stopReplay();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 shadow-2xl w-80 flex flex-col gap-4 max-h-[80vh]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{burger.emoji}</span>
            <div>
              <h2 className="text-xl font-black text-gray-800">{burger.name}</h2>
              <p className="text-xs text-gray-400 font-semibold">{burger.ingredients.length}가지 재료</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-300 hover:text-gray-500 text-2xl font-black transition-colors"
          >
            ×
          </button>
        </div>

        <div className="bg-amber-50 rounded-2xl p-3 flex flex-col items-center" style={{ minHeight: 240 }}>
          <div className="h-6 mb-1 flex items-center">
            {isReplaying && currentIngredient ? (
              <span className="text-sm font-black text-amber-600 animate-pulse">
                {INGREDIENT_LABELS[currentIngredient]} 추가!
              </span>
            ) : replayPlaced.length > 0 && !isReplaying ? (
              <span className="text-sm font-black text-green-600">완성! 🎉</span>
            ) : (
              <span className="text-sm font-black text-amber-400">재료를 쌓는 중...</span>
            )}
          </div>
          <div className="flex flex-col-reverse items-center w-full flex-1 overflow-hidden justify-end">
            {replayPlaced.map((type, i) => (
              <div
                key={i}
                className={`flex justify-center w-full ${i === replayPlaced.length - 1 ? 'ingredient-fall' : ''}`}
                style={{ marginBottom: i === 0 ? 0 : type === 'top_bun' ? 0 : -10 }}
              >
                <IngredientSVG type={type} width={200} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => startReplay(burger.ingredients)}
          disabled={isReplaying}
          className="w-full bg-purple-400 hover:bg-purple-500 text-white font-black text-lg rounded-2xl py-3 shadow-[0_4px_0_#7e22ce] active:shadow-none active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isReplaying ? '재생 중...' : '🔄 다시 보기'}
        </button>
      </div>
    </div>
  );
}
