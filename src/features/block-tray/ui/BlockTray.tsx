import { useDraggable } from '@dnd-kit/core';
import type { IngredientType } from '../../../shared/types';
import { BLOCK_LABELS } from '../../../entities/burger/data/burgers';
import { BLOCK_COLORS } from '../../../entities/block/model/colors';

export { BLOCK_COLORS } from '../../../entities/block/model/colors';

function DraggableBlock({ type, used, highlight }: { type: IngredientType; used?: boolean; highlight?: boolean }) {
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
      } ${highlight ? 'ring-4 ring-yellow-300 animate-pulse' : ''}`}
    >
      {BLOCK_LABELS[type]}
    </div>
  );
}

interface BlockTrayProps {
  ingredients: IngredientType[];
  usedIngredients: IngredientType[];
  highlightType?: IngredientType;
}

export default function BlockTray({ ingredients, usedIngredients, highlightType }: BlockTrayProps) {
  return (
    <div className="bg-sky-50 rounded-3xl p-4 shadow-inner">
      <h3 className="text-lg font-black text-sky-800 mb-3 text-center">🧩 코드 블록</h3>
      <div className="flex flex-col gap-2">
        {ingredients.map(type => (
          <DraggableBlock key={type} type={type} used={usedIngredients.includes(type)} highlight={type === highlightType} />
        ))}
      </div>
    </div>
  );
}
