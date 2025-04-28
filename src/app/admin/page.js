"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [text, setText] = useState("");
  const [keyPath, setKeyPath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text || !keyPath) {
      setError("텍스트와 키 경로를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, keyPath }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "번역 처리 중 오류가 발생했습니다.");
      }

      setResult(data.translations);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">번역 관리</h1>

      <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h2 className="text-lg font-semibold mb-2">사용 방법</h2>
        <p className="mb-2">1. 번역할 텍스트를 입력하세요.</p>
        <p className="mb-2">
          2. 키 경로를 입력하세요 (예: <code>common.welcome</code> 또는{" "}
          <code>pages.home.title</code>).
        </p>
        <p className="mb-2">
          3. 제출을 클릭하면 모든 지원 언어로 자동 번역됩니다.
        </p>
        <p className="mb-2">
          4. 번역된 결과는 <code>/public/locales/[언어코드].json</code> 파일에
          저장됩니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="text" className="block mb-2 font-medium">
            번역할 텍스트 (한국어 권장)
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="번역할 텍스트를 입력하세요"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="keyPath" className="block mb-2 font-medium">
            키 경로
          </label>
          <input
            id="keyPath"
            type="text"
            value={keyPath}
            onChange={(e) => setKeyPath(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="common.welcome"
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-md ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isLoading ? "번역 중..." : "번역하기"}
        </button>
      </form>

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">번역 결과</h2>
          <div className="bg-gray-50 p-4 rounded-md border">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={() => router.push("/")}
          className="text-blue-500 hover:underline"
        >
          홈페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
