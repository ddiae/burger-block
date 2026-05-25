import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext, DragOverlay, PointerSensor,
  pointerWithin, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { pageBg } from '@ddiae-ui';
import { BLOCK_LABELS, INGREDIENT_LABELS } from '../../../entities/burger/data/burgers';
import type { IngredientType } from '../../../shared/types';
import { BlockTray, BLOCK_COLORS } from '../../../features/block-tray';
import { BlockCanvas, mkChainId } from '../../../features/block-canvas';
import type { CBChain } from '../../../features/block-canvas';
import { mkBlockId } from '../../../entities/block/model/types';
import IngredientSVG from '../../../entities/burger/ui/IngredientSVG';
import { type SavedBurger, FREE_STORAGE_KEY, loadSaved } from '../model/types';
import { useFreeExecution } from '../model/useFreeExecution';
import SaveBurgerModal from './SaveBurgerModal';
import BurgerReplayModal from './BurgerReplayModal';

const FREE_INGREDIENTS: IngredientType[] = [
  'bottom_bun', 'patty', 'cheese', 'lettuce', 'tomato',
  'onion', 'bulgogi_sauce', 'cheese_sauce', 'special_sauce', 'bacon', 'egg', 'top_bun',
];

function primaryChain(chains: CBChain[]): CBChain | null {
  if (!chains.length) return null;
  return [...chains].sort((a, b) => a.y - b.y)[0];
}

export default function FreeModePage() {
  const navigate = useNavigate();
  const [chains, setChains] = useState<CBChain[]>([]);
  const [activeType, setActiveType] = useState<IngredientType | null>(null);
  const [isTrayDrag, setIsTrayDrag] = useState(false);
  const [savedBurgers, setSavedBurgers] = useState<SavedBurger[]>(loadSaved);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [replayBurger, setReplayBurger] = useState<SavedBurger | null>(null);

  const primary = primaryChain(chains);
  const placed = useMemo(
    () => primary ? primary.items.map(b => b.type) : [] as IngredientType[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chains]
  );
  const usedTypes = new Set(chains.flatMap(ch => ch.items.map(b => b.type)));

  const { isRunning, runningIndex, animatedPlaced, isDone, currentIngredient, handleRun, handleReset } =
    useFreeExecution(placed);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragStart = (event: DragStartEvent) => {
    if (isRunning) return;
    setActiveType(event.active.data.current?.type ?? null);
    setIsTrayDrag(String(event.active.id).startsWith('block-'));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveType(null);
    setIsTrayDrag(false);
    if (!over || !String(active.id).startsWith('block-') || over.id !== 'block-canvas') return;

    const type = active.data.current?.type as IngredientType;
    if (usedTypes.has(type)) return;

    const canvasRect = over.rect;
    const activeRect = active.rect.current.translated;
    const x = activeRect ? activeRect.left - canvasRect.left : 40;
    const y = activeRect ? activeRect.top - canvasRect.top : 40;

    let snapped = false;
    let next = [...chains];
    const SNAP_Y = 22, SNAP_X = 72;

    outer: for (const ch of next) {
      for (let i = 0; i < ch.items.length; i++) {
        const bx = ch.x, by = ch.y + i * 40;
        if (Math.abs(x - bx) < SNAP_X && Math.abs(y - (by + 40)) < SNAP_Y) {
          next = next.map(c => c.id === ch.id
            ? { ...c, items: [...c.items.slice(0, i + 1), { id: mkBlockId(), type }, ...c.items.slice(i + 1)] }
            : c);
          snapped = true; break outer;
        }
        if (Math.abs(x - bx) < SNAP_X && Math.abs((y + 40) - by) < SNAP_Y) {
          next = next.map(c => c.id === ch.id
            ? { ...c, items: [{ id: mkBlockId(), type }, ...c.items] }
            : c);
          snapped = true; break outer;
        }
      }
    }

    if (!snapped) {
      next.push({ id: mkChainId(), x: Math.max(8, x), y: Math.max(8, y), items: [{ id: mkBlockId(), type }] });
    }
    setChains(next);
  };

  const handleSave = (name: string, emoji: string) => {
    const newBurger: SavedBurger = {
      id: Date.now().toString(),
      name,
      emoji,
      ingredients: animatedPlaced.length > 0 ? animatedPlaced : placed,
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };
    const updated = [newBurger, ...savedBurgers];
    setSavedBurgers(updated);
    localStorage.setItem(FREE_STORAGE_KEY, JSON.stringify(updated));
    setShowSaveModal(false);
    setChains([]);
    handleReset();
  };

  const handleDelete = (id: string) => {
    const updated = savedBurgers.filter(b => b.id !== id);
    setSavedBurgers(updated);
    localStorage.setItem(FREE_STORAGE_KEY, JSON.stringify(updated));
  };

  const handleCodeReset = () => { setChains([]); handleReset(); };
  const showExecution = isRunning || animatedPlaced.length > 0;

  return (
    <div className={`h-screen flex flex-col ${pageBg} overflow-hidden`}>
      <header className="flex items-center justify-between px-5 py-4 bg-white/70 backdrop-blur shadow-sm shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-lg font-black text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 py-2 px-3 rounded-xl hover:bg-white/60"
        >
          ← 홈
        </button>
        <span className="text-2xl font-black text-gray-800">🎨 자율 모드</span>
        <div className="w-32" />
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">

          {/* 왼쪽: 실행 화면 */}
          <div className="w-72 shrink-0">
            {showExecution ? (
              <div className="bg-amber-50 rounded-2xl shadow p-4 h-full flex flex-col overflow-hidden">
                <div className="text-center mb-2 shrink-0">
                  <h3 className="text-xl font-black text-amber-800">🍔 실행 중...</h3>
                  <div className="h-7 mt-1 flex items-center justify-center">
                    {currentIngredient ? (
                      <span className="text-base font-black text-amber-600 animate-pulse">
                        {INGREDIENT_LABELS[currentIngredient]} 추가!
                      </span>
                    ) : animatedPlaced.length > 0 ? (
                      <span className="text-base font-black text-green-600">완성! 🎉</span>
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
                {isDone && (
                  <button
                    onClick={() => setShowSaveModal(true)}
                    className="mt-3 w-full bg-purple-400 hover:bg-purple-500 text-white font-black text-lg rounded-2xl py-3 shadow-[0_4px_0_#7e22ce] active:shadow-none active:translate-y-1 transition-all shrink-0"
                  >
                    💾 내 버거 저장하기
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white/60 rounded-2xl shadow p-4 h-full flex flex-col items-center justify-center gap-4 text-center">
                <span className="text-6xl">🍽️</span>
                <p className="text-xl font-black text-gray-400">완성된 버거가</p>
                <p className="text-xl font-black text-gray-400">여기 나타나요!</p>
                <p className="text-sm font-semibold text-gray-300">블록을 쌓고 실행해봐요</p>
              </div>
            )}
          </div>

          {/* 가운데: 코드 블록 팔레트 */}
          <div className="w-72 shrink-0 flex flex-col gap-2">
            <p className="text-lg font-black text-gray-600 px-1">🧩 코드 블록</p>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <BlockTray ingredients={FREE_INGREDIENTS} usedIngredients={[...usedTypes]} />
            </div>
          </div>

          {/* 오른쪽: 캔버스 */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <p className="text-lg font-black text-gray-600 px-1">📋 내 코드</p>
            <div className="flex-1 min-h-0">
              <BlockCanvas
                chains={chains}
                onChange={setChains}
                runningChainId={primary?.id}
                runningIndex={runningIndex}
                disabled={isRunning}
                trayDragging={isTrayDrag}
              />
            </div>
            <div className="flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={handleCodeReset}
                disabled={isRunning}
                className="text-lg font-black text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-white/60 min-h-14 disabled:opacity-30"
              >
                🔄 초기화
              </button>
              <button
                onClick={handleRun}
                disabled={placed.length === 0 || isRunning}
                className="bg-purple-400 hover:bg-purple-500 text-white font-black text-xl rounded-2xl px-8 py-4 transition-all shadow-[0_5px_0_#7e22ce] active:shadow-none active:translate-y-1 cursor-pointer min-h-14 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ▶ 코드 실행하기!
              </button>
            </div>
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeType && isTrayDrag ? (
            <div className={`${BLOCK_COLORS[activeType]} border-b-4 text-white font-black text-base rounded-xl px-3 py-2 shadow-xl opacity-90 pointer-events-none`}>
              {BLOCK_LABELS[activeType]}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* 하단: 나의 버거 리스트 */}
      <div className="shrink-0 bg-white/70 backdrop-blur border-t border-white/50 px-4 py-3">
        <p className="text-base font-black text-gray-600 mb-2">🍔 나의 버거 리스트</p>
        {savedBurgers.length === 0 ? (
          <p className="text-sm font-semibold text-gray-300 py-1">
            아직 저장된 버거가 없어요. 블록을 쌓고 실행 후 저장해봐요!
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {savedBurgers.map(b => (
              <div key={b.id} className="shrink-0 bg-white rounded-2xl p-3 shadow-sm flex items-center gap-3 min-w-55">
                <span className="text-3xl">{b.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-800 text-base truncate">{b.name}</p>
                  <p className="text-xs text-gray-400 font-semibold">{b.ingredients.length}가지 재료 · {b.createdAt}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {b.ingredients.slice(0, 3).map((ing, i) => (
                      <span key={i} className={`${BLOCK_COLORS[ing]} text-white text-xs font-black rounded px-1.5 py-0.5`}>
                        {BLOCK_LABELS[ing]}
                      </span>
                    ))}
                    {b.ingredients.length > 3 && (
                      <span className="text-xs text-gray-400 font-bold self-center">+{b.ingredients.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => setReplayBurger(b)}
                    className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-black text-sm rounded-xl px-3 py-1.5 transition-all"
                  >
                    ▶ 플레이
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="text-gray-300 hover:text-red-400 text-xs font-black transition-colors text-center"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSaveModal && (
        <SaveBurgerModal
          ingredients={animatedPlaced.length > 0 ? animatedPlaced : placed}
          onSave={handleSave}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {replayBurger && (
        <BurgerReplayModal
          burger={replayBurger}
          onClose={() => setReplayBurger(null)}
        />
      )}
    </div>
  );
}
