"use client";

import { useState, FormEvent } from "react";

export default function HomePage() {
  const [text, setText] = useState<string>("");
  const [keyPath, setKeyPath] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text || !keyPath) {
      setError("텍스트와 키 경로를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

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

      if (data.translations === null) {
        throw new Error("번역 결과를 가져오지 못했습니다.");
      }

      setResult(data.translations);
      setIsLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-2xl px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-400">
          번역 관리
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-md mb-8"
        >
          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 font-medium text-lg text-gray-300"
            >
              번역할 텍스트
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              rows={5}
              placeholder="번역할 텍스트를 입력하세요"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="keyPath"
              className="block mb-2 font-medium text-lg text-gray-300"
            >
              키 경로
            </label>
            <input
              id="keyPath"
              type="text"
              value={keyPath}
              onChange={(e) => setKeyPath(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="ex) words.welcome"
              required
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-100 rounded-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-md text-lg font-semibold transition duration-200 ease-in-out ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                번역 중...
              </span>
            ) : (
              "번역하기"
            )}
          </button>
        </form>

        {result && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">
              번역 결과
            </h2>
            <div className="bg-gray-700 p-4 rounded-md border border-gray-600 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-200">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
