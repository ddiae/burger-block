import { useState } from 'react';

interface PasswordModalProps {
  onSuccess: () => void;
  onClose: () => void;
  correctPassword: string;
  title: string;
}

export default function PasswordModal({ onSuccess, onClose, correctPassword, title }: PasswordModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (value === correctPassword) {
      onSuccess();
    } else {
      setError(true);
      setValue('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl">
        <h2 className="text-3xl font-black text-center mb-6 text-gray-800">{title}</h2>
        <input
          type="password"
          maxLength={20}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          className="w-full text-center text-4xl font-black border-4 border-purple-200 rounded-2xl py-5 mb-4 outline-none focus:border-purple-400 transition-colors"
          placeholder="••••"
          autoFocus
        />
        {error && (
          <p className="text-red-400 text-center font-black mb-4 text-xl">
            비밀번호가 틀렸어요! 😢
          </p>
        )}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-2xl text-xl font-black text-gray-400 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 rounded-2xl text-xl font-black text-white bg-purple-400 shadow-[0_4px_0_#7c3aed] active:shadow-none active:translate-y-1 hover:bg-purple-500 transition-all cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
