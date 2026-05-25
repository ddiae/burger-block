import { useRef, useState } from "react";
import type { IngredientType } from "../../../shared/types";
import { BLOCK_LABELS } from "../../../entities/burger/data/burgers";
import { BLOCK_COLORS } from "../../../features/block-tray";

const EMOJIS = [
  "🍔",
  "😋",
  "♥️",
  "⭐️",
  "🍳",
  "🍅",
  "👍",
  "🌶️",
  "🍟",
  "🧂",
  "🎀",
  "🧩"
];

interface SaveBurgerModalProps {
  ingredients: IngredientType[];
  onSave: (name: string, emoji: string) => void;
  onClose: () => void;
}

export default function SaveBurgerModal({
  ingredients,
  onSave,
  onClose
}: SaveBurgerModalProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🍔");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), emoji);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm flex flex-col gap-5">
        <h2 className="text-2xl font-black text-gray-800 text-center">
          🍔 내 버거 이름 짓기
        </h2>

        <div>
          <p className="text-base font-black text-gray-600 mb-2">이모지 선택</p>
          <div className="flex flex-wrap gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`text-2xl w-10 h-10 rounded-xl transition-all ${emoji === e ? "bg-purple-100 ring-2 ring-purple-400 scale-110" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-base font-black text-gray-600 mb-2">버거 이름</p>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            placeholder="나의 특별한 버거"
            maxLength={20}
            autoFocus
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-lg font-black text-gray-800 focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          {ingredients.map((ing, i) => (
            <span
              key={i}
              className={`${BLOCK_COLORS[ing]} text-white text-sm font-black rounded-lg px-2 py-1`}
            >
              {BLOCK_LABELS[ing]}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-black text-lg rounded-2xl py-3 transition-all"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 bg-purple-400 hover:bg-purple-500 text-white font-black text-lg rounded-2xl py-3 shadow-[0_4px_0_#7e22ce] active:shadow-none active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            저장!
          </button>
        </div>
      </div>
    </div>
  );
}
