import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import type { IngredientType } from '../../types';
import { BLOCK_LABELS } from '../../data/burgers';
import { BLOCK_COLORS } from './BlockTray';

interface SortableBlockProps {
  id: string;
  type: IngredientType;
  realIndex: number;
  connectsAbove: boolean;
  connectsBelow: boolean;
  isRunning: boolean;
  onRemove: (index: number) => void;
}

function SortableBlock({ id, type, realIndex, connectsAbove, connectsBelow, isRunning, onRemove }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const colorClass = BLOCK_COLORS[type] ?? 'bg-gray-400 border-gray-600';

  const isOnly = !connectsAbove && !connectsBelow;
  const radiusClass = isOnly
    ? 'rounded-2xl'
    : !connectsAbove
    ? 'rounded-t-2xl rounded-b-none'
    : !connectsBelow
    ? 'rounded-t-none rounded-b-2xl'
    : 'rounded-none';

  const borderClass = connectsBelow ? 'border-b border-black/15' : 'border-b-4';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${colorClass} ${radiusClass} ${borderClass} text-white font-black text-lg px-3 py-3 min-h-12 flex items-center gap-2 group shadow-sm select-none transition-all ${isRunning ? 'scale-105 ring-4 ring-white ring-offset-2 shadow-lg z-10' : ''}`}
    >
      <span
        {...listeners}
        {...attributes}
        className="flex items-center gap-2 cursor-grab active:cursor-grabbing"
      >
        <span className="opacity-40 group-hover:opacity-80 transition-opacity text-base leading-none">⠿</span>
        {BLOCK_LABELS[type]}
      </span>
      <button
        onPointerDown={e => e.stopPropagation()}
        onClick={() => onRemove(realIndex)}
        className="opacity-0 group-hover:opacity-100 bg-white/20 hover:bg-white/40 rounded-lg w-7 h-7 flex items-center justify-center text-sm font-black transition-all shrink-0"
      >
        ✕
      </button>
    </div>
  );
}

function PreviewBlock({ type }: { type: IngredientType }) {
  const colorClass = BLOCK_COLORS[type] ?? 'bg-gray-400 border-gray-600';
  return (
    <div className={`${colorClass} border-b-4 rounded-xl px-3 py-3 min-h-12 inline-flex items-center gap-2 opacity-40 pointer-events-none my-0.5`}>
      <span className="text-base leading-none opacity-60">⠿</span>
      <span className="flex-1 text-white font-black text-lg">{BLOCK_LABELS[type]}</span>
    </div>
  );
}

interface BlockStackProps {
  placed: IngredientType[];
  onRemove: (index: number) => void;
  previewType?: IngredientType | null;
  previewInsertIndex?: number;
  runningIndex?: number;
}

export default function BlockStack({ placed, onRemove, previewType, previewInsertIndex = -1, runningIndex = -1 }: BlockStackProps) {
  const { isOver, setNodeRef } = useDroppable({ id: 'block-stack' });

  type DisplayItem =
    | { kind: 'real'; type: IngredientType; realIndex: number }
    | { kind: 'preview'; type: IngredientType };

  const displayItems: DisplayItem[] = placed.map((type, i) => ({ kind: 'real', type, realIndex: i }));

  if (previewType && previewInsertIndex >= 0) {
    const insertAt = Math.min(previewInsertIndex, placed.length);
    displayItems.splice(insertAt, 0, { kind: 'preview', type: previewType });
  }

  const isEmpty = placed.length === 0 && (!previewType || previewInsertIndex < 0);

  return (
    <div
      ref={setNodeRef}
      className={`h-full min-h-48 rounded-3xl border-4 border-dashed transition-all p-4 ${
        isOver
          ? 'border-sky-400 bg-sky-100'
          : isEmpty
          ? 'border-gray-300 bg-gray-50'
          : 'border-sky-300 bg-sky-50'
      }`}
    >
      {isEmpty ? (
        <p className="text-gray-400 font-black text-2xl text-center mt-8">
          여기에 블록을 드래그해요! 🧩
        </p>
      ) : (
        <SortableContext items={placed.map((_, i) => `sorted-${i}`)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col items-start">
            {displayItems.map((entry, displayIdx) => {
              if (entry.kind === 'preview') {
                return <PreviewBlock key="preview" type={entry.type} />;
              }

              const prev = displayIdx > 0 ? displayItems[displayIdx - 1] : null;
              const next = displayIdx < displayItems.length - 1 ? displayItems[displayIdx + 1] : null;
              const connectsAbove = prev?.kind === 'real';
              const connectsBelow = next?.kind === 'real';

              return (
                <SortableBlock
                  key={`sorted-${entry.realIndex}`}
                  id={`sorted-${entry.realIndex}`}
                  type={entry.type}
                  realIndex={entry.realIndex}
                  connectsAbove={connectsAbove}
                  connectsBelow={connectsBelow}
                  isRunning={entry.realIndex === runningIndex}
                  onRemove={onRemove}
                />
              );
            })}
          </div>
        </SortableContext>
      )}
    </div>
  );
}
