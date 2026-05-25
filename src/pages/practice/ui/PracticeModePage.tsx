import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext, DragOverlay, PointerSensor,
  pointerWithin, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { pageBg } from '@ddiae-ui';
import { BURGERS, BLOCK_LABELS } from '../../../entities/burger/data/burgers';
import type { IngredientType } from '../../../shared/types';
import { RecipePanel } from '../../../widgets/recipe-panel';
import { BlockTray, BLOCK_COLORS } from '../../../features/block-tray';
import { BlockCanvas, mkChainId } from '../../../features/block-canvas';
import type { CBChain } from '../../../features/block-canvas';
import { ExecutionView } from '../../../widgets/execution-view';
import FeedbackModal from '../../../shared/ui/FeedbackModal';
import PasswordModal from '../../../shared/ui/PasswordModal';
import PASSWORDS from '../../../shared/config/passwords';
import { useExecution } from '../../../features/execution';
import { mkBlockId } from '../../../entities/block/model/types';

// 연습 모드: 기본 버거 + 디버그 스테이지 2개
const PRACTICE_BURGERS = [BURGERS[0], BURGERS[6], BURGERS[7]]; // 기본 버거, debug_extra_basic, debug_flip

function primaryChain(chains: CBChain[]): CBChain | null {
  if (!chains.length) return null;
  return [...chains].sort((a, b) => a.y - b.y)[0];
}

export default function PracticeModePage() {
  const navigate = useNavigate();
  const [burgerIndex, setBurgerIndex] = useState(0);
  const [chains, setChains] = useState<CBChain[]>([]);
  const [activeType, setActiveType] = useState<IngredientType | null>(null);
  const [isTrayDrag, setIsTrayDrag] = useState(false);
  const [done, setDone] = useState(false);
  const [showCodingModal, setShowCodingModal] = useState(false);

  const recipe = PRACTICE_BURGERS[burgerIndex];
  const usedTypes = new Set(chains.flatMap(ch => ch.items.map(b => b.type)));

  const primary = primaryChain(chains);
  const placed = useMemo(
    () => primary ? primary.items.map(b => b.type) : [] as IngredientType[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chains]
  );

  // 디버그 스테이지: burgerIndex 변경 시 initialSequence로 캔버스 초기화
  useEffect(() => {
    if (recipe.initialSequence?.length) {
      setChains([{
        id: mkChainId(),
        x: 40, y: 40,
        items: recipe.initialSequence.map(type => ({ id: mkBlockId(), type })),
      }]);
    } else {
      setChains([]);
    }
  }, [burgerIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const {
    isRunning, runningIndex, animatedPlaced,
    handleRun, handleReset: execReset,
    currentIngredient,
    isCorrect, showFeedback, feedback,
    handleRetry, handleNext: execNext,
  } = useExecution(placed, recipe);

  const makeInitialChains = (): CBChain[] => {
    if (!recipe.initialSequence?.length) return [];
    return [{ id: mkChainId(), x: 40, y: 40, items: recipe.initialSequence.map(type => ({ id: mkBlockId(), type })) }];
  };

  const handleReset = () => { setChains(makeInitialChains()); execReset(); };

  const handleNext = () => {
    if (burgerIndex < PRACTICE_BURGERS.length - 1) {
      execNext(() => setBurgerIndex(prev => prev + 1));
    } else {
      execNext(() => setDone(true));
    }
  };

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

  if (done) {
    return (
      <div className={`min-h-screen ${pageBg} flex flex-col items-center justify-center gap-8`}>
        <div className="text-center">
          <div className="text-7xl mb-4">🎊</div>
          <h2 className="text-4xl font-black text-gray-800 mb-2">연습 완료!</h2>
          <p className="text-xl text-gray-500 font-bold">코딩 모드에서 더 어려운 버거에 도전해봐요!</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="bg-green-400 hover:bg-green-500 text-white font-black text-xl rounded-2xl px-10 py-4 shadow-[0_5px_0_#065f46] active:shadow-none active:translate-y-1 transition-all"
        >
          🏠 홈으로
        </button>
      </div>
    );
  }

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
          {recipe.isDebug ? (
            <span className="text-2xl font-black text-orange-500">🐛 디버그 모드</span>
          ) : (
            <span className="text-2xl font-black text-gray-800">🌱 연습 모드</span>
          )}
          <span className={`text-base font-black rounded-full px-3 py-1 ${recipe.isDebug ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-400'}`}>
            {burgerIndex + 1} / {PRACTICE_BURGERS.length}
          </span>
        </div>
        <div className="flex gap-2">
          {PRACTICE_BURGERS.map((b, i) => (
            <span key={b.id} className={`w-3.5 h-3.5 rounded-full transition-all ${
              i < burgerIndex
                ? 'bg-green-400'
                : i === burgerIndex
                  ? (b.isDebug ? 'bg-orange-400 scale-125' : 'bg-green-400 scale-125')
                  : b.isDebug ? 'bg-orange-200' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">
          {/* 왼쪽: 레시피 / 실행화면 */}
          <div className="w-72 shrink-0">
            {isRunning || animatedPlaced.length > 0 ? (
              <ExecutionView
                animatedPlaced={animatedPlaced}
                currentIngredient={currentIngredient}
              />
            ) : (
              <RecipePanel recipe={recipe} />
            )}
          </div>

          {/* 가운데: 코드 블록 팔레트 */}
          <div className="w-72 shrink-0 flex flex-col gap-2">
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
                trayDragging={isTrayDrag}
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
                className="bg-green-400 hover:bg-green-500 text-white font-black text-xl rounded-2xl px-8 py-4 transition-all shadow-[0_5px_0_#065f46] active:shadow-none active:translate-y-1 cursor-pointer min-h-14 disabled:opacity-40 disabled:cursor-not-allowed"
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

      {showCodingModal && (
        <PasswordModal
          title="💻 코딩 모드 비밀번호"
          correctPassword={PASSWORDS.coding}
          onSuccess={() => { setShowCodingModal(false); navigate('/coding'); }}
          onClose={() => setShowCodingModal(false)}
        />
      )}

      {showFeedback && (
        <FeedbackModal
          feedback={feedback}
          isCorrect={isCorrect}
          isLastBurger={burgerIndex === PRACTICE_BURGERS.length - 1 && isCorrect}
          onRetry={handleRetry}
          onNext={handleNext}
          onGoToCoding={() => { execReset(); setShowCodingModal(true); }}
          goToCodingLabel="💻 코딩 모드 가기!"
          onRestart={() => {
            execReset();
            setBurgerIndex(0);
          }}
        />
      )}
    </div>
  );
}
