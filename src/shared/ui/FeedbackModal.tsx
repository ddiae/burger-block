import type { Feedback } from '../types';

interface FeedbackModalProps {
  feedback: Feedback | null;
  isCorrect: boolean;
  isLastBurger: boolean;
  onRetry: () => void;
  onNext: () => void;
  onGoToCoding?: () => void;
  onRestart?: () => void;
}

export default function FeedbackModal({
  feedback,
  isCorrect,
  isLastBurger,
  onRetry,
  onNext,
  onGoToCoding,
  onRestart,
}: FeedbackModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl text-center">
        {isCorrect ? (
          <>
            <div className="text-8xl mb-5">🎉</div>
            <h2 className="text-4xl font-black mb-4 text-green-500">
              {isLastBurger ? "모두 완성!" : "정답이에요!"}
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {isLastBurger
                ? "버거를 모두 만들었어요!\n정말 대단해요! 🌟"
                : "다음 버거도 만들어볼까요?"}
            </p>
            <div className="flex flex-col gap-3">
              {isLastBurger && onGoToCoding ? (
                <>
                  <ActionButton color="green" onClick={onGoToCoding}>
                    🎨 자율 모드 가기!
                  </ActionButton>
                  <ActionButton color="ghost" onClick={onRestart ?? onRetry}>
                    처음부터 다시하기
                  </ActionButton>
                </>
              ) : (
                <ActionButton color="green" onClick={onNext}>
                  다음 버거 만들기 →
                </ActionButton>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="text-8xl mb-5">
              {feedback?.type === "wrong_order"
                ? "🔀"
                : feedback?.type === "unnecessary"
                  ? "❌"
                  : "🤔"}
            </div>
            <h2 className="text-4xl font-black mb-4 text-red-400">
              {feedback?.type === "wrong_order"
                ? "순서가 달라요!"
                : feedback?.type === "unnecessary"
                  ? "필요없는 재료예요!"
                  : "뭔가 빠졌어요!"}
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {feedback?.message ?? "다시 확인해 보세요!"}
            </p>
            <ActionButton color="pink" onClick={onRetry}>
              확인했어요! 고쳐볼게요 💪
            </ActionButton>
          </>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  color,
  onClick,
  children
}: {
  color: "green" | "pink" | "ghost";
  onClick: () => void;
  children: React.ReactNode;
}) {
  const styles = {
    green:
      "bg-green-400 text-white shadow-[0_5px_0_#15803d] active:shadow-none active:translate-y-1 hover:bg-green-500",
    pink: "bg-pink-400 text-white shadow-[0_5px_0_#be185d] active:shadow-none active:translate-y-1 hover:bg-pink-500",
    ghost: "bg-gray-100 text-gray-500 hover:bg-gray-200"
  };
  return (
    <button
      onClick={onClick}
      className={`w-full font-black text-2xl rounded-2xl py-5 transition-all cursor-pointer ${styles[color]}`}
    >
      {children}
    </button>
  );
}
