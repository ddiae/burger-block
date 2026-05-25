import { useNavigate } from "react-router-dom";
import { Button } from "@ddiae-ui";
import { Card } from "@ddiae-ui";
import { pageBg } from "@ddiae-ui";
import { BURGERS } from "../data/burgers";

export default function TeacherModePage() {
  const navigate = useNavigate();

  const jumpTo = (mode: "real" | "coding", index: number) => {
    const key = mode === "real" ? "burger-block-real" : "burger-block-coding";
    sessionStorage.setItem(key, JSON.stringify({ index }));
    navigate(`/${mode}`);
  };

  return (
    <div className={`min-h-screen ${pageBg} p-6`}>
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="w-auto px-4"
        >
          ← 홈
        </Button>
        <h1 className="text-3xl font-black text-gray-800">👩‍🏫 선생님 모드</h1>
        <div className="w-24" />
      </div>

      <div className="max-w-4xl mx-auto">
        <p className="text-center text-gray-600 font-bold mb-6">
          버거와 모드를 선택하면 바로 이동해요!
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 font-black text-gray-700 text-lg">
                  버거
                </th>
                <th className="px-4 py-2 font-black text-yellow-700 text-lg">
                  🍔 현실 모드
                </th>
                <th className="px-4 py-2 font-black text-sky-700 text-lg">
                  💻 코딩 모드
                </th>
              </tr>
            </thead>
            <tbody>
              {BURGERS.map((burger, i) => (
                <tr key={burger.id} className="border-t border-gray-200">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{burger.emoji}</span>
                      <div>
                        <p className="font-black text-gray-800">
                          {burger.name}
                        </p>
                        <p className="text-sm text-gray-500 whitespace-pre-line">
                          {burger.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          재료 {burger.sequence.length}가지
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => jumpTo("real", i)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-black rounded-xl px-5 py-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      현실 모드로 바로가기
                    </button>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => jumpTo("coding", i)}
                      className="bg-sky-400 hover:bg-sky-500 text-white font-black rounded-xl px-5 py-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                    >
                      코딩 모드로 바로가기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card variant="gradient" color="purple" className="mt-8">
          <h3 className="font-black text-purple-800 mb-2 text-lg">
            📚 수업 가이드
          </h3>
          <ul className="text-purple-700 font-bold space-y-1 text-sm">
            <li>① 현실 모드에서 먼저 순서 개념을 가르쳐요</li>
            <li>② 버거 만들기 성공 후 코딩 모드로 이동해요</li>
            <li>③ 코딩 모드에서 블록 순서 = 명령어 순서를 배워요</li>
            <li>④ 블록을 드래그해서 순서를 바꿀 수 있어요</li>
            <li>⑤ 6가지 버거를 모두 완성하면 기초 코딩 완성!</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
