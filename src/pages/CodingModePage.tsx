import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext, DragOverlay, PointerSensor,
  closestCenter, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { pageBg } from '@ddiae-ui';
import { BURGERS, BLOCK_LABELS } from '../data/burgers';
import type { IngredientType, Feedback } from '../types';
import { validate } from '../utils/validator';
import RecipePanel from '../components/RecipePanel';
import BlockTray, { BLOCK_COLORS } from '../components/coding/BlockTray';
import BlockCanvas, { mkChainId, mkBlockId } from '../components/coding/BlockCanvas';
import type { CBChain } from '../components/coding/BlockCanvas';
import ExecutionView from '../components/coding/ExecutionView';
import FeedbackModal from '../components/feedback/FeedbackModal';

const STORAGE_KEY = 'burger-block-coding';
const STEP_MS = 700;

/** Primary chain = topmost (smallest y) */
function primaryChain(chains: CBChain[]): CBChain | null {
  if (!chains.length) return null;
  return [...chains].sort((a, b) => a.y - b.y)[0];
}

export default function CodingModePage() {
  const navigate = useNavigate();
  const [burgerIndex, setBurgerIndex] = useState<number>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).index ?? 0 : 0;
  });
  const [chains, setChains] = useState<CBChain[]>([]);
  const [activeType, setActiveType] = useState<IngredientType | null>(null);
  const [isTrayDrag, setIsTrayDrag] = useState(false);

  // Execution
  const [isRunning, setIsRunning] = useState(false);
  const [runningIndex, setRunningIndex] = useState(-1);
  const [animatedPlaced, setAnimatedPlaced] = useState<IngredientType[]>([]);

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const recipe = BURGERS[burgerIndex];

  // All used types (across all chains) for tray greying
  const usedTypes = new Set(chains.flatMap(ch => ch.items.map(b => b.type)));

  // Derived placed sequence from primary chain
  const primary = primaryChain(chains);
  const placed = useMemo(
    () => primary ? primary.items.map(b => b.type) : [] as IngredientType[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chains]
  );

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ index: burgerIndex }));
  }, [burgerIndex]);

  // Step-by-step execution
  useEffect(() => {
    if (!isRunning) return;
    if (runningIndex >= placed.length) {
      const t = setTimeout(() => {
        setIsRunning(false);
        setRunningIndex(-1);
        const result = validate(placed, recipe);
        setIsCorrect(result.isCorrect);
        setFeedback(result.feedback);
        setShowFeedback(true);
      }, STEP_MS);
      return () => clearTimeout(t);
    }
    // Drop ingredient shortly after block highlights, then advance
    const t1 = setTimeout(() => {
      setAnimatedPlaced(prev => [...prev, placed[runningIndex]]);
    }, 120);
    const t2 = setTimeout(() => {
      setRunningIndex(prev => prev + 1);
    }, STEP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isRunning, runningIndex, placed, recipe]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const handleDragStart = (event: DragStartEvent) => {
    if (isRunning) return;
    const fromTray = String(event.active.id).startsWith('block-');
    setActiveType(event.active.data.current?.type ?? null);
    setIsTrayDrag(fromTray);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveType(null);
    setIsTrayDrag(false);
    if (!over) return;

    const fromTray = String(active.id).startsWith('block-');
    if (!fromTray) return;
    if (over.id !== 'block-canvas') return;

    const type = active.data.current?.type as IngredientType;
    if (usedTypes.has(type)) return;

    // Compute drop position relative to canvas
    const canvasRect = over.rect;
    const activeRect = active.rect.current.translated;
    const x = activeRect ? activeRect.left - canvasRect.left : 40;
    const y = activeRect ? activeRect.top  - canvasRect.top  : 40;

    // Check if we can snap to an existing chain
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
        const tailBottom = y + 40;
        if (Math.abs(x - bx) < SNAP_X && Math.abs(tailBottom - by) < SNAP_Y) {
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

  const handleRun = () => {
    if (placed.length === 0 || isRunning) return;
    setAnimatedPlaced([]);
    setRunningIndex(0);
    setIsRunning(true);
  };

  const handleReset = () => {
    setChains([]);
    setShowFeedback(false); setFeedback(null); setIsCorrect(false);
    setIsRunning(false); setRunningIndex(-1); setAnimatedPlaced([]);
  };

  const handleRetry = () => {
    setShowFeedback(false); setFeedback(null); setIsCorrect(false);
    setAnimatedPlaced([]);
  };

  const handleNext = () => {
    setChains([]);
    setShowFeedback(false); setFeedback(null); setIsCorrect(false);
    setAnimatedPlaced([]);
    setBurgerIndex(prev => Math.min(prev + 1, BURGERS.length - 1));
  };

  return (
    <div className={`h-screen flex flex-col ${pageBg} overflow-hidden`}>
      <header className="flex items-center justify-between px-5 py-4 bg-white/70 backdrop-blur shadow-sm shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-lg font-black text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 py-2 px-3 rounded-xl hover:bg-white/60"
        >
          ← 홈
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-gray-800">💻 코딩 모드</span>
          <span className="text-base font-black text-gray-400 bg-gray-100 rounded-full px-3 py-1">
            {burgerIndex + 1} / {BURGERS.length}
          </span>
        </div>
        <div className="flex gap-2">
          {BURGERS.map((b, i) => (
            <span key={b.id} className={`w-3.5 h-3.5 rounded-full transition-all ${
              i < burgerIndex ? 'bg-green-400' : i === burgerIndex ? 'bg-sky-400 scale-125' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">

          {/* 왼쪽: 레시피 / 실행화면 */}
          <div className="w-72 shrink-0">
            {isRunning || animatedPlaced.length > 0 ? (
              <ExecutionView
                animatedPlaced={animatedPlaced}
                currentType={isRunning && runningIndex > 0 ? placed[runningIndex - 1] : null}
              />
            ) : (
              <RecipePanel recipe={recipe} />
            )}
          </div>

          {/* 가운데: 코드 블록 팔레트 */}
          <div className="w-52 shrink-0 flex flex-col gap-2">
            <p className="text-lg font-black text-gray-600 px-1">🧩 코드 블록</p>
            <div className="flex-1 min-h-0 overflow-y-auto">
              <BlockTray
                ingredients={recipe.availableIngredients}
                usedIngredients={[...usedTypes]}
              />
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
              />
            </div>
            <div className="flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={handleReset}
                disabled={isRunning}
                className="text-lg font-black text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-white/60 min-h-14 disabled:opacity-30"
              >
                🔄 초기화
              </button>
              <button
                onClick={handleRun}
                disabled={placed.length === 0 || isRunning}
                className="bg-sky-400 hover:bg-sky-500 text-white font-black text-xl rounded-2xl px-8 py-4 transition-all shadow-[0_5px_0_#0369a1] active:shadow-none active:translate-y-1 cursor-pointer min-h-14 disabled:opacity-40 disabled:cursor-not-allowed"
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

      {showFeedback && (
        <FeedbackModal
          feedback={feedback}
          isCorrect={isCorrect}
          isLastBurger={burgerIndex === BURGERS.length - 1 && isCorrect}
          onRetry={handleRetry}
          onNext={handleNext}
          onGoToCoding={() => { sessionStorage.removeItem(STORAGE_KEY); navigate('/'); }}
        />
      )}
    </div>
  );
}
