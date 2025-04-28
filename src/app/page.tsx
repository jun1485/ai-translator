"use client";

import Link from "next/link";
import { useTranslation, SUPPORTED_LOCALES } from "@/lib/i18n";
import { ChangeEvent } from "react";

export default function Home() {
  const { t, locale, setLocale } = useTranslation();

  const handleChangeLocale = (e: ChangeEvent<HTMLSelectElement>) => {
    setLocale(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {t("common.title") || "Translator 예제"}
          </h1>

          <div className="flex items-center">
            <label htmlFor="locale-select" className="mr-2">
              언어:
            </label>
            <select
              id="locale-select"
              value={locale}
              onChange={handleChangeLocale}
              className="p-2 border border-gray-300 rounded"
            >
              {SUPPORTED_LOCALES.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main>
        <section className="mb-10 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {t("home.welcome") || "자동번역 시스템에 오신 것을 환영합니다!"}
          </h2>
          <p className="mb-4">
            {t("home.description") ||
              "이 예제는 Next.js와 OpenAI API를 사용하여 다국어 번역을 자동화하는 방법을 보여줍니다."}
          </p>
          <p>
            {t("home.instruction") ||
              "번역을 관리하려면 아래 관리자 페이지 링크를 클릭하세요."}
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            {t("home.features.title") || "주요 기능"}
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("home.features.item1") || "OpenAI API를 통한 자동 번역"}</li>
            <li>
              {t("home.features.item2") || "다중 언어 지원 (30개 이상의 언어)"}
            </li>
            <li>
              {t("home.features.item3") ||
                "중첩된 키 경로로 구조화된 번역 관리"}
            </li>
            <li>
              {t("home.features.item4") || "JSON 형식의 간편한 로컬 저장소"}
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">
            {t("home.started.title") || "시작하기"}
          </h2>
          <div className="flex flex-col space-y-4">
            <Link
              href="/admin"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-center"
            >
              {t("home.started.admin") || "번역 관리 페이지"}
            </Link>
          </div>
        </section>
      </main>

      <footer className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500">
        <p>
          {t("common.footer") ||
            "© 2024 Translator 예제. Next.js와 OpenAI로 제작되었습니다."}
        </p>
      </footer>
    </div>
  );
}
