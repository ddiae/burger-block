import type { IngredientType } from '../../types';
import { INGREDIENT_LABELS } from '../../data/burgers';
import IngredientSVG from '../real/IngredientSVG';

interface ExecutionViewProps {
  animatedPlaced: IngredientType[];
  currentType: IngredientType | null;
}

export default function ExecutionView({ animatedPlaced, currentType }: ExecutionViewProps) {
  return (
    <div className="bg-amber-50 rounded-2xl shadow p-4 h-full flex flex-col overflow-hidden">
      <div className="text-center mb-2 shrink-0">
        <h3 className="text-xl font-black text-amber-800">🍔 실행 중...</h3>
        <div className="h-7 mt-1 flex items-center justify-center">
          {currentType ? (
            <span className="text-base font-black text-amber-600 animate-pulse">
              {INGREDIENT_LABELS[currentType]} 추가!
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
            className={`w-full ${i === animatedPlaced.length - 1 ? 'ingredient-fall' : ''}`}
            style={{ marginBottom: i === 0 ? 0 : type === 'top_bun' ? 0 : -10 }}
          >
            <IngredientSVG type={type} width={224} />
          </div>
        ))}
      </div>
    </div>
  );
}
