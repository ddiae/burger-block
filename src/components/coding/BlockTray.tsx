import { useDraggable } from '@dnd-kit/core';
import type { IngredientType } from '../../types';
import { BLOCK_LABELS } from '../../data/burgers';

export const BLOCK_COLORS: Record<IngredientType, string> = {
  bottom_bun: 'bg-amber-400 border-amber-600',
  top_bun: 'bg-amber-400 border-amber-600',
  patty: 'bg-orange-800 border-orange-950',
  cheese: 'bg-yellow-400 border-yellow-600',
  lettuce: 'bg-green-500 border-green-700',
  tomato: 'bg-red-500 border-red-700',
  onion: 'bg-purple-400 border-purple-600',
  bulgogi_sauce: 'bg-orange-700 border-orange-900',
  cheese_sauce: 'bg-yellow-500 border-yellow-700',
  special_sauce: 'bg-red-600 border-red-800',
  bacon: 'bg-red-700 border-red-900',
  egg: 'bg-yellow-300 border-yellow-500',
};

function DraggableBlock({ type, used }: { type: IngredientType; used?: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `block-${type}`,
    data: { type },
    disabled: used,
  });

  const colorClass = BLOCK_COLORS[type] ?? 'bg-gray-400 border-gray-600';

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`${colorClass} border-b-4 text-white font-black text-base rounded-xl px-3 py-2 min-h-9 w-full overflow-hidden select-none transition-all shadow-md ${
        used
          ? 'opacity-30 cursor-not-allowed'
          : isDragging
          ? 'opacity-40 cursor-grabbing'
          : 'cursor-grab hover:scale-105 hover:shadow-lg active:cursor-grabbing'
      }`}
    >
      {BLOCK_LABELS[type]}
    </div>
  );
}

interface BlockTrayProps {
  ingredients: IngredientType[];
  usedIngredients: IngredientType[];
}

export default function BlockTray({ ingredients, usedIngredients }: BlockTrayProps) {
  return (
    <div className="bg-sky-50 rounded-3xl p-4 shadow-inner">
      <h3 className="text-lg font-black text-sky-800 mb-3 text-center">🧩 코드 블록</h3>
      <div className="flex flex-col gap-2">
        {ingredients.map(type => (
          <DraggableBlock key={type} type={type} used={usedIngredients.includes(type)} />
        ))}
      </div>
    </div>
  );
}
