import type { IngredientType } from '../types';
import IngredientSVG from './real/IngredientSVG';

interface BurgerPreviewProps {
  placed: IngredientType[];
}

export default function BurgerPreview({ placed }: BurgerPreviewProps) {
  return (
    <div className="bg-amber-50 rounded-3xl p-4 shadow-inner h-full min-h-48 flex flex-col">
      <h3 className="text-xl font-black text-amber-800 mb-3 text-center">🍔 버거 미리보기</h3>
      {placed.length === 0 ? (
        <p className="text-gray-400 font-black text-lg text-center mb-4">
          블록을 추가하면 버거가 완성돼요!
        </p>
      ) : (
        <div className="flex flex-col-reverse items-center">
          {placed.map((type, i) => (
            <div key={`preview-${i}`} className="w-full max-w-[240px]" style={{ marginBottom: i === 0 ? 0 : -6 }}>
              <IngredientSVG type={type} width={240} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
