import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext, DragOverlay, PointerSensor,
  closestCenter, pointerWithin, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent, CollisionDetection } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { pageBg } from '@ddiae-ui';
import { BURGERS } from '../data/burgers';
import type { IngredientType, Feedback, PlacedItem } from '../types';
import { validate } from '../utils/validator';
import RecipePanel from '../components/RecipePanel';
import IngredientTray from '../components/real/IngredientTray';
import BurgerStack from '../components/real/BurgerStack';
import IngredientSVG from '../components/real/IngredientSVG';
import FeedbackModal from '../components/feedback/FeedbackModal';

const STORAGE_KEY = 'burger-block-real';
let _idCounter = 0;
const makeId = (type: IngredientType) => `${type}-${++_idCounter}`;

export default function RealModePage() {
  const navigate = useNavigate();
  const [burgerIndex, setBurgerIndex] = useState<number>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).index ?? 0 : 0;
  });
  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [activeType, setActiveType] = useState<IngredientType | null>(null);
  const [isTrayDrag, setIsTrayDrag] = useState(false);
  const [previewOverId, setPreviewOverId] = useState<string | null | 'stack'>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const recipe = BURGERS[burgerIndex];

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ index: burgerIndex }));
  }, [burgerIndex]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));

  // 트레이 드래그는 포인터가 실제로 droppable 위에 있을 때만 인식
  const collisionDetection: CollisionDetection = isTrayDrag ? pointerWithin : closestCenter;

  const handleDragStart = (event: DragStartEvent) => {
    const fromTray = String(event.active.id).startsWith('tray-');
    setActiveType(event.active.data.current?.type ?? null);
    setIsTrayDrag(fromTray);
    if (fromTray) setPreviewOverId('stack');
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!String(active.id).startsWith('tray-')) return;
    if (!over) setPreviewOverId(null);
    else if (over.id === 'burger-stack') setPreviewOverId('stack');
    else setPreviewOverId(String(over.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveType(null);
    setIsTrayDrag(false);
    setPreviewOverId(null);

    const fromTray = String(active.id).startsWith('tray-');
    if (fromTray) {
      if (!over) return;
      const type = active.data.current?.type as IngredientType;
      if (placed.some(p => p.type === type)) return;
      const newItem: PlacedItem = { id: makeId(type), type };
      const overIndex = placed.findIndex(p => p.id === over.id);
      const insertAt = overIndex !== -1 ? overIndex + 1 : placed.length;
      setPlaced([...placed.slice(0, insertAt), newItem, ...placed.slice(insertAt)]);
    } else {
      if (over && active.id !== over.id) {
        setPlaced(prev => {
          const from = prev.findIndex(p => p.id === active.id);
          const to = prev.findIndex(p => p.id === over.id);
          return from !== -1 && to !== -1 ? arrayMove(prev, from, to) : prev;
        });
      }
    }
  };

  const handleCheck = () => {
    const result = validate(placed.map(p => p.type), recipe);
    setIsCorrect(result.isCorrect);
    setFeedback(result.feedback);
    setShowFeedback(true);
  };

  const handleRemove = (id: string) => setPlaced(prev => prev.filter(p => p.id !== id));

  const handleRetry = () => { setShowFeedback(false); setFeedback(null); setIsCorrect(false); };
  const handleNext = () => {
    setPlaced([]); setShowFeedback(false); setFeedback(null); setIsCorrect(false);
    setBurgerIndex(prev => Math.min(prev + 1, BURGERS.length - 1));
  };

  const previewInsertIndex = (() => {
    if (!isTrayDrag || !activeType || !previewOverId) return -1;
    if (previewOverId === 'stack') return placed.length;
    const i = placed.findIndex(p => p.id === previewOverId);
    return i !== -1 ? i + 1 : placed.length;
  })();

  return (
    <div className={`h-screen flex flex-col ${pageBg} overflow-hidden`}>
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-white/70 backdrop-blur shadow-sm shrink-0">
        <button
          onClick={() => navigate('/')}
          className="text-lg font-black text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1 py-2 px-3 rounded-xl hover:bg-white/60"
        >
          ← 홈
        </button>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-gray-800">🍔 현실 모드</span>
          <span className="text-base font-black text-gray-400 bg-gray-100 rounded-full px-3 py-1">
            {burgerIndex + 1} / {BURGERS.length}
          </span>
        </div>
        <div className="flex gap-2">
          {BURGERS.map((b, i) => (
            <span key={b.id} className={`w-3.5 h-3.5 rounded-full transition-all ${
              i < burgerIndex ? 'bg-green-400' : i === burgerIndex ? 'bg-yellow-400 scale-125' : 'bg-gray-200'
            }`} />
          ))}
        </div>
      </header>

      {/* Main */}
      <DndContext sensors={sensors} collisionDetection={collisionDetection}
        onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="flex flex-1 gap-4 p-4 overflow-hidden min-h-0">
          {/* Recipe */}
          <div className="w-52 shrink-0">
            <RecipePanel recipe={recipe} />
          </div>

          {/* Stack + actions */}
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="flex-1 min-h-0">
              <BurgerStack
                placed={placed}
                onRemove={handleRemove}
                previewType={isTrayDrag ? activeType : null}
                previewInsertIndex={previewInsertIndex}
              />
            </div>
            {/* Action row */}
            <div className="flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => { setPlaced([]); setShowFeedback(false); setFeedback(null); setIsCorrect(false); }}
                className="text-lg font-black text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 px-4 py-3 rounded-2xl hover:bg-white/60 min-h-14"
              >
                🔄 다시 시작
              </button>
              <button
                onClick={handleCheck}
                className="bg-green-400 hover:bg-green-500 text-white font-black text-xl rounded-2xl px-8 py-4 transition-all shadow-[0_5px_0_#15803d] active:shadow-none active:translate-y-1 cursor-pointer min-h-14"
              >
                ✅ 완성! 확인하기
              </button>
            </div>
          </div>
        </div>

        {/* Tray — inside DndContext so useDraggable works */}
        <div className="shrink-0">
          <IngredientTray
            ingredients={recipe.availableIngredients}
            placedIngredients={placed.map(p => p.type)}
          />
        </div>

        <DragOverlay dropAnimation={null}>
          {activeType && (
            <div className="w-48 opacity-90 pointer-events-none">
              <IngredientSVG type={activeType} width={192} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {showFeedback && (
        <FeedbackModal
          feedback={feedback}
          isCorrect={isCorrect}
          isLastBurger={burgerIndex === BURGERS.length - 1 && isCorrect}
          onRetry={handleRetry}
          onNext={handleNext}
          onGoToCoding={() => { sessionStorage.removeItem(STORAGE_KEY); navigate('/coding'); }}
        />
      )}
    </div>
  );
}
