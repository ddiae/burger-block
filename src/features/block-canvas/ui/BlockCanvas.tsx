import { useRef, useState, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { IngredientType } from '../../../shared/types';
import { BLOCK_LABELS } from '../../../entities/burger/data/burgers';
import { BLOCK_COLORS } from '../../../entities/block/model/colors';
import { BLOCK_H, mkChainId } from '../../../entities/block/model/types';
import type { CBChain, CBItem } from '../../../entities/block/model/types';

export { BLOCK_H, mkChainId } from '../../../entities/block/model/types';
export type { CBChain, CBItem } from '../../../entities/block/model/types';

const SNAP_Y = 18;
const SNAP_X = 72;

interface SnapTarget { chainId: string; insertIdx: number; x: number; y: number }

interface DragState {
  chainId: string; fromIdx: number;
  startPX: number; startPY: number;
  startCX: number; startCY: number;
  curX: number; curY: number;
  snap: SnapTarget | null;
}

interface BlockCanvasProps {
  chains: CBChain[];
  onChange: (chains: CBChain[]) => void;
  runningChainId?: string;
  runningIndex?: number;
  disabled?: boolean;
  trayDragging?: boolean;
}

function findSnap(dropX: number, dropY: number, tailLen: number, searchChains: CBChain[]): SnapTarget | null {
  for (const ch of searchChains) {
    for (let i = 0; i < ch.items.length; i++) {
      const bx = ch.x, by = ch.y + i * BLOCK_H;
      if (Math.abs(dropX - bx) < SNAP_X && Math.abs(dropY - (by + BLOCK_H)) < SNAP_Y)
        return { chainId: ch.id, insertIdx: i + 1, x: bx, y: by + BLOCK_H };
      if (Math.abs(dropX - bx) < SNAP_X && Math.abs((dropY + tailLen * BLOCK_H) - by) < SNAP_Y)
        return { chainId: ch.id, insertIdx: i, x: bx, y: by - tailLen * BLOCK_H };
    }
  }
  return null;
}

// w-64 = 256px = same as tray block (w-72 container - p-4*2 padding)
const BASE = 'w-64 py-2 min-h-9 px-3 text-base font-black text-white flex items-center gap-1.5';

function radius(isFirst: boolean, isLast: boolean) {
  return isFirst && isLast ? 'rounded-xl'
    : isFirst ? 'rounded-t-xl rounded-b-none'
    : isLast  ? 'rounded-t-none rounded-b-xl'
    : 'rounded-none';
}
const border = (isLast: boolean) => isLast ? 'border-b-4' : 'border-b border-black/15';

export default function BlockCanvas({
  chains, onChange, runningChainId, runningIndex = -1, disabled, trayDragging,
}: BlockCanvasProps) {
  const [drag, setDrag] = useState<DragState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: 'block-canvas' });

  const checkOverTrash = (curX: number, curY: number): boolean => {
    if (!trashRef.current || !containerRef.current) return false;
    const cr = containerRef.current.getBoundingClientRect();
    const tr = trashRef.current.getBoundingClientRect();
    const gx = cr.left + curX, gy = cr.top + curY;
    return gx < tr.right && gx + 256 > tr.left && gy < tr.bottom && gy + BLOCK_H > tr.top;
  };

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    setDropRef(el);
    (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  }, [setDropRef]);

  const onBlockPointerDown = (e: React.PointerEvent, chainId: string, fromIdx: number) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();
    const ch = chains.find(c => c.id === chainId)!;
    containerRef.current?.setPointerCapture(e.pointerId);
    setDrag({
      chainId, fromIdx,
      startPX: e.clientX, startPY: e.clientY,
      startCX: ch.x, startCY: ch.y + fromIdx * BLOCK_H,
      curX: ch.x, curY: ch.y + fromIdx * BLOCK_H,
      snap: null,
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const curX = drag.startCX + (e.clientX - drag.startPX);
    const curY = drag.startCY + (e.clientY - drag.startPY);
    const srcChain = chains.find(c => c.id === drag.chainId)!;
    const head = srcChain.items.slice(0, drag.fromIdx);
    const tail = srcChain.items.slice(drag.fromIdx);
    const searchChains = chains
      .map(c => c.id === drag.chainId ? (head.length ? { ...c, items: head } : null) : c)
      .filter(Boolean) as CBChain[];
    const snap = checkOverTrash(curX, curY) ? null : findSnap(curX, curY, tail.length, searchChains);
    setDrag(d => d ? { ...d, curX, curY, snap } : null);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drag) return;
    const dropX = drag.startCX + (e.clientX - drag.startPX);
    const dropY = drag.startCY + (e.clientY - drag.startPY);
    const srcChain = chains.find(c => c.id === drag.chainId)!;
    const head = srcChain.items.slice(0, drag.fromIdx);
    const tail = srcChain.items.slice(drag.fromIdx);
    let next: CBChain[] = chains
      .map(c => c.id === drag.chainId ? (head.length ? { ...c, items: head } : null) : c)
      .filter(Boolean) as CBChain[];
    const overTrash = checkOverTrash(dropX, dropY);
    const snap = overTrash ? null : (drag.snap ?? findSnap(dropX, dropY, tail.length, next));
    if (overTrash) {
      // discard tail — next already has head only
    } else if (snap) {
      next = next.map(c => c.id === snap.chainId
        ? { ...c, items: [...c.items.slice(0, snap.insertIdx), ...tail, ...c.items.slice(snap.insertIdx)] }
        : c);
    } else if (!overTrash) {
      next.push({ id: mkChainId(), x: Math.max(8, dropX), y: Math.max(8, dropY), items: tail });
    }
    onChange(next);
    setDrag(null);
  };

  const dragSrc    = drag ? chains.find(c => c.id === drag.chainId) : null;
  const dragItems  = dragSrc ? dragSrc.items.slice(drag!.fromIdx) : [];
  const isOverTrash = drag ? checkOverTrash(drag.curX, drag.curY) : false;

  return (
    <div
      ref={setRefs}
      className={`relative w-full h-full rounded-3xl border-4 border-dashed transition-colors overflow-hidden ${
        isOver ? 'border-sky-400 bg-sky-50' : 'border-gray-200 bg-white/60'
      }`}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {chains.length === 0 && !drag && (
        <p className="absolute inset-0 flex items-center justify-center text-gray-400 font-black text-xl pointer-events-none">
          블록을 여기에 드래그해요! 🧩
        </p>
      )}

      {/* Trash zone — visible while dragging (canvas or tray) */}
      {(drag || trayDragging) && (
        <div
          ref={trashRef}
          className={`absolute bottom-4 right-4 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all shadow-lg pointer-events-none ${
            isOverTrash
              ? 'bg-red-500 scale-125 shadow-red-300'
              : 'bg-gray-200/80'
          }`}
        >
          🗑️
        </div>
      )}

      {/* Snap preview */}
      {drag?.snap && dragItems.length > 0 && (
        <div style={{ position: 'absolute', left: drag.snap.x, top: drag.snap.y, pointerEvents: 'none', zIndex: 50 }}>
          {dragItems.map((block, i) => (
            <div key={block.id} className={`${BLOCK_COLORS[block.type] ?? 'bg-gray-400 border-gray-600'} ${radius(i===0, i===dragItems.length-1)} ${border(i===dragItems.length-1)} ${BASE} opacity-40 ring-2 ring-white`}>
              <span className="opacity-40 text-xs leading-none shrink-0">⠿</span>
              {BLOCK_LABELS[block.type]}
            </div>
          ))}
        </div>
      )}

      {/* Chains */}
      {chains.map(ch => {
        const isDragging   = drag?.chainId === ch.id;
        const visibleItems = isDragging ? ch.items.slice(0, drag!.fromIdx) : ch.items;
        if (!visibleItems.length) return null;
        return (
          <div key={ch.id} style={{ position: 'absolute', left: ch.x, top: ch.y }}>
            {visibleItems.map((block, i) => {
              const isHighlight = ch.id === runningChainId && i === runningIndex;
              const colorClass  = BLOCK_COLORS[block.type] ?? 'bg-gray-400 border-gray-600';
              return (
                <div
                  key={block.id}
                  onPointerDown={e => onBlockPointerDown(e, ch.id, i)}
                  className={`${colorClass} ${radius(i===0, i===visibleItems.length-1)} ${border(i===visibleItems.length-1)} ${BASE} select-none cursor-grab active:cursor-grabbing shadow-sm ${
                    isHighlight ? 'ring-4 ring-yellow-300 ring-offset-2 scale-110 shadow-[0_0_16px_4px_rgba(253,224,71,0.6)] relative z-10' : ''
                  }`}
                >
                  <span className="opacity-35 text-xs leading-none shrink-0">⠿</span>
                  {BLOCK_LABELS[block.type]}
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Drag ghost */}
      {drag && dragItems.length > 0 && (
        <div style={{ position: 'absolute', left: drag.curX, top: drag.curY, pointerEvents: 'none', zIndex: 100 }}>
          {dragItems.map((block, i) => (
            <div key={block.id} className={`${BLOCK_COLORS[block.type] ?? 'bg-gray-400 border-gray-600'} ${radius(i===0, i===dragItems.length-1)} ${border(i===dragItems.length-1)} ${BASE} shadow-2xl ${drag.snap ? 'opacity-50' : 'opacity-90'}`}>
              <span className="opacity-35 text-xs leading-none shrink-0">⠿</span>
              {BLOCK_LABELS[block.type]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
