import type { IngredientType } from '../../../shared/types';
import { INGREDIENT_LABELS } from '../../../entities/burger/data/burgers';
import IngredientSVG from '../../../entities/burger/ui/IngredientSVG';

interface ExecutionViewProps {
  animatedPlaced: IngredientType[];
  currentIngredient: IngredientType | null;
}

export default function ExecutionView({ animatedPlaced, currentIngredient }: ExecutionViewProps) {
  return (
    <div className="bg-amber-50 rounded-2xl shadow p-4 h-full flex flex-col overflow-hidden">
      <div className="text-center mb-2 shrink-0">
        <h3 className="text-xl font-black text-amber-800">🍔 실행 중...</h3>
        <div className="h-7 mt-1 flex items-center justify-center">
          {currentIngredient ? (
            <span className="text-base font-black text-amber-600 animate-pulse">
              {INGREDIENT_LABELS[currentIngredient]} 추가!
            </span>
          ) : animatedPlaced.length > 0 ? (
            <span className="text-base font-black text-green-600">완성!</span>
          ) : null}
        </div>
      </div>

      <div className="flex-1 flex flex-col-reverse items-center justify-end overflow-hidden">
        {animatedPlaced.map((type, i) => (
          <div
            key={i}
            className={`flex justify-center ${i === animatedPlaced.length - 1 ? 'ingredient-fall' : ''}`}
            style={{ marginBottom: i === 0 ? 0 : type === 'top_bun' ? 0 : -10 }}
          >
            <IngredientSVG type={type} width={224} />
          </div>
        ))}
      </div>
    </div>
  );
}
