import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageBg } from '@ddiae-ui';
import PasswordModal from '../../../shared/ui/PasswordModal';
import PASSWORDS from '../../../shared/config/passwords';
import { setupTeacherShortcut } from '../../../utils/teacher';

const FREE_UNLOCK_KEY = 'burger-block-free-unlocked';

export default function HomePage() {
  const navigate = useNavigate();
  const [showCodingModal, setShowCodingModal] = useState(false);
  const [freeUnlocked] = useState(() => sessionStorage.getItem(FREE_UNLOCK_KEY) === 'true');
  const [showLockToast, setShowLockToast] = useState(false);

  useEffect(() => {
    return setupTeacherShortcut(() => navigate('/teacher'));
  }, [navigate]);

  const handleFreeClick = () => {
    if (freeUnlocked) {
      navigate('/free');
    } else {
      setShowLockToast(true);
      setTimeout(() => setShowLockToast(false), 2500);
    }
  };

  return (
    <div className={`min-h-screen ${pageBg} flex flex-col items-center justify-center p-8 gap-10`}>
      {/* Logo */}
      <div className="text-center">
        <div className="text-8xl mb-4 drop-shadow-lg" style={{ filter: 'drop-shadow(0 8px 0 #b45309)' }}>🍔</div>
        <h1 className="text-5xl font-black text-gray-800 tracking-tight mb-2">버거 블록</h1>
        <p className="text-lg text-gray-500 font-bold">버거를 만들면서 코딩을 배워요!</p>
      </div>

      {/* Mode buttons */}
      <div className="flex gap-5 w-full max-w-2xl">
        <ModeCard
          emoji="🌱"
          label="연습 모드"
          desc="선생님과 함께 배워요"
          bg="from-green-400 to-emerald-500"
          shadow="#065f46"
          onClick={() => navigate('/practice')}
        />
        <ModeCard
          emoji="💻"
          label="코딩 모드"
          desc="블록으로 코드를 짜요"
          bg="from-sky-400 to-blue-500"
          shadow="#0369a1"
          onClick={() => setShowCodingModal(true)}
        />
        <ModeCard
          emoji={freeUnlocked ? '🎨' : '🔒'}
          label="자율 모드"
          desc={freeUnlocked ? '나만의 버거를 만들어요' : '코딩 모드를 완수하면 열려요!'}
          bg={freeUnlocked ? 'from-purple-400 to-pink-500' : 'from-gray-300 to-gray-400'}
          shadow={freeUnlocked ? '#7e22ce' : '#6b7280'}
          onClick={handleFreeClick}
          locked={!freeUnlocked}
        />
      </div>

      <p className="text-gray-400 text-sm font-semibold">선생님 모드: Shift + T</p>

      {/* Lock toast */}
      {showLockToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white font-black text-base rounded-2xl px-6 py-3 shadow-xl z-50 animate-bounce">
          💻 코딩 모드를 모두 완수해야 열려요!
        </div>
      )}

      {showCodingModal && (
        <PasswordModal
          title="💻 코딩 모드 비밀번호"
          correctPassword={PASSWORDS.coding}
          onSuccess={() => { setShowCodingModal(false); navigate('/coding'); }}
          onClose={() => setShowCodingModal(false)}
        />
      )}
    </div>
  );
}

function ModeCard({
  emoji, label, desc, bg, shadow, onClick, locked,
}: {
  emoji: string; label: string; desc: string; bg: string; shadow: string; onClick: () => void; locked?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 bg-linear-to-br ${bg} rounded-3xl p-6 text-white text-left transition-all select-none ${
        locked ? 'cursor-not-allowed opacity-80' : 'cursor-pointer active:translate-y-1 hover:scale-[1.03]'
      }`}
      style={{ boxShadow: `0 6px 0 ${shadow}` }}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <div className="text-2xl font-black mb-1">{label}</div>
      <div className="text-sm font-semibold opacity-80">{desc}</div>
    </button>
  );
}
