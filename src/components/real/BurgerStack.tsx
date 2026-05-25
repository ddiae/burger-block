import { useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PlacedItem, IngredientType } from '../../types';
import { INGREDIENT_LABELS } from '../../data/burgers';
import IngredientSVG from './IngredientSVG';

interface SortableLayerProps {
  item: PlacedItem;
  onRemove: (id: string) => void;
}

function SortableLayer({ item, onRemove }: SortableLayerProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={`w-full max-w-70 relative group ${isDragging ? 'opacity-30' : ''}`}>
      <div {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
        <IngredientSVG type={item.type} width={280} />
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-black transition-all flex items-center justify-center"
        title={`${INGREDIENT_LABELS[item.type]} 제거`}
      >
        ✕
      </button>
    </div>
  );
}

interface BurgerStackProps {
  placed: PlacedItem[];
  onRemove: (id: string) => void;
  previewType?: IngredientType | null;
  previewInsertIndex?: number; // -1 or placed.length = append; >= 0 = insert before that index
}

export default function BurgerStack({ placed, onRemove, previewType, previewInsertIndex = -1 }: BurgerStackProps) {
  const { isOver, setNodeRef } = useDroppable({ id: 'burger-stack' });

  // Build display list: real items + ghost preview inserted at right position
  type DisplayItem = { kind: 'real'; item: PlacedItem } | { kind: 'preview'; type: IngredientType };
  const displayItems: DisplayItem[] = placed.map(item => ({ kind: 'real', item }));

  if (previewType && previewInsertIndex >= 0) {
    const insertAt = Math.min(previewInsertIndex, placed.length);
    displayItems.splice(insertAt, 0, { kind: 'preview', type: previewType });
  }

  const isEmpty = placed.length === 0 && !previewType;

  return (
    <div
      ref={setNodeRef}
      className={`h-full min-h-48 rounded-3xl border-4 border-dashed transition-all flex flex-col-reverse items-center justify-start p-4 ${
        isOver ? 'border-green-400 bg-green-50' : isEmpty ? 'border-gray-300 bg-gray-50' : 'border-amber-300 bg-amber-50'
      }`}
    >
      {isEmpty ? (
        <p className="text-gray-400 font-black text-2xl m-auto">여기에 재료를 올려요! 🍞</p>
      ) : (
        <SortableContext items={placed.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="w-full flex flex-col-reverse items-center">
            {displayItems.map((entry, i) => (
              <div
                key={entry.kind === 'real' ? entry.item.id : `preview-${entry.type}`}
                className="w-full flex justify-center"
                style={{ marginBottom: i === 0 ? 0 : -8 }}
              >
                {entry.kind === 'preview' ? (
                  <div className="w-full max-w-70 opacity-40 pointer-events-none">
                    <IngredientSVG type={entry.type} width={280} />
                  </div>
                ) : (
                  <SortableLayer item={entry.item} onRemove={onRemove} />
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
