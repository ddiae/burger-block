import { useDraggable } from '@dnd-kit/core';
import type { IngredientType } from '../../types';
import { INGREDIENT_LABELS, INGREDIENT_EMOJIS } from '../../data/burgers';
import IngredientSVG from './IngredientSVG';

function DraggableIngredient({ type, disabled }: { type: IngredientType; disabled?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `tray-${type}`,
    data: { type },
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm border-2 select-none transition-all shrink-0 min-h-14 ${
        disabled
          ? 'opacity-30 cursor-not-allowed border-transparent'
          : isDragging
          ? 'opacity-40 border-transparent cursor-grabbing'
          : 'border-transparent hover:border-amber-300 cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="w-28">
        <IngredientSVG type={type} width={112} />
      </div>
      <span className="text-sm font-black text-gray-700 whitespace-nowrap">
        {INGREDIENT_EMOJIS[type]} {INGREDIENT_LABELS[type]}
      </span>
    </div>
  );
}

export default function IngredientTray({
  ingredients,
  placedIngredients,
}: {
  ingredients: IngredientType[];
  placedIngredients: IngredientType[];
}) {
  return (
    <div className="bg-amber-50 border-t-2 border-amber-100 px-5 py-4">
      <p className="text-base font-black text-amber-700 mb-3">🧺 재료 창고</p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {ingredients.map(type => (
          <DraggableIngredient key={type} type={type} disabled={placedIngredients.includes(type)} />
        ))}
      </div>
    </div>
  );
}
