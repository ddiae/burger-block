import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pageBg } from '@ddiae-ui';
import PasswordModal from '../components/PasswordModal';
import { setupTeacherShortcut } from '../utils/teacher';
import PASSWORDS from '../config/passwords';

type ModalTarget = 'real' | 'coding' | 'teacher' | null;

export default function HomePage() {
  const navigate = useNavigate();
  const [modalTarget, setModalTarget] = useState<ModalTarget>(null);

  useEffect(() => {
    return setupTeacherShortcut(() => setModalTarget('teacher'));
  }, []);

  const handleSuccess = (target: ModalTarget) => {
    setModalTarget(null);
    if (target === 'real') navigate('/real');
    else if (target === 'coding') navigate('/coding');
    else if (target === 'teacher') navigate('/teacher');
  };

  const PASSWORDS_MAP = {
    real: PASSWORDS.real,
    coding: PASSWORDS.coding,
    teacher: PASSWORDS.teacher,
  };

  const TITLES = {
    real: '🍔 현실 모드 비밀번호',
    coding: '💻 코딩 모드 비밀번호',
    teacher: '👩‍🏫 선생님 모드 비밀번호',
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
      <div className="flex gap-5 w-full max-w-lg">
        <ModeCard
          emoji="🍔"
          label="현실 모드"
          desc="재료를 직접 쌓아요"
          bg="from-yellow-400 to-orange-400"
          shadow="#b45309"
          onClick={() => setModalTarget('real')}
        />
        <ModeCard
          emoji="💻"
          label="코딩 모드"
          desc="블록으로 코드를 짜요"
          bg="from-sky-400 to-blue-500"
          shadow="#0369a1"
          onClick={() => setModalTarget('coding')}
        />
      </div>

      <p className="text-gray-400 text-sm font-semibold">선생님 모드: Shift + T</p>

      {modalTarget && (
        <PasswordModal
          title={TITLES[modalTarget]}
          correctPassword={PASSWORDS_MAP[modalTarget]}
          onSuccess={() => handleSuccess(modalTarget)}
          onClose={() => setModalTarget(null)}
        />
      )}
    </div>
  );
}

function ModeCard({
  emoji, label, desc, bg, shadow, onClick,
}: {
  emoji: string; label: string; desc: string; bg: string; shadow: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 bg-linear-to-br ${bg} rounded-3xl p-6 text-white text-left cursor-pointer transition-all active:translate-y-1 hover:scale-[1.03] select-none`}
      style={{ boxShadow: `0 6px 0 ${shadow}` }}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <div className="text-2xl font-black mb-1">{label}</div>
      <div className="text-sm font-semibold opacity-80">{desc}</div>
    </button>
  );
}
