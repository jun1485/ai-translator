"use client";

import { useState, useEffect, createContext, useContext } from "react";

const SUPPORTED_LOCALES = [
  { code: "en", name: "English" },
  { code: "ko", name: "한국어" },
  { code: "ja", name: "日本語" },
  { code: "zh", name: "中文" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsch" },
];

// i18n 컨텍스트 생성
const I18nContext = createContext({
  locale: "ko",
  setLocale: (newLocale) => {},
  t: (key) => key,
  translations: {},
});

// 번역 데이터 로드 함수
async function loadTranslations(locale) {
  try {
    const response = await fetch(`/locales/${locale}.json`);
    if (!response.ok) {
      console.error(`로케일 ${locale}을 로드할 수 없습니다`);
      return {};
    }
    return await response.json();
  } catch (error) {
    console.error("번역 데이터 로드 오류:", error);
    return {};
  }
}

// 중첩된 키로 번역 값 가져오기
function getNestedTranslation(obj, path) {
  const keys = path.split(".");
  return keys.reduce((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return acc[key];
    }
    return path; // 키를 찾지 못한 경우 원래 경로 반환
  }, obj);
}

// I18n 공급자 컴포넌트
export function I18nProvider({ children, defaultLocale = "ko" }) {
  const [locale, setLocale] = useState(defaultLocale);
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 브라우저 언어 설정 확인
    const browserLocale = navigator.language.split("-")[0];
    const initialLocale = SUPPORTED_LOCALES.some(
      (l) => l.code === browserLocale
    )
      ? browserLocale
      : defaultLocale;

    // 저장된 언어 설정 확인
    const savedLocale = localStorage.getItem("locale") || initialLocale;
    setLocale(savedLocale);

    // 번역 데이터 로드
    loadTranslations(savedLocale).then((data) => {
      setTranslations(data);
      setLoading(false);
    });
  }, [defaultLocale]);

  // 언어 변경 시 번역 데이터 다시 로드
  useEffect(() => {
    localStorage.setItem("locale", locale);
    loadTranslations(locale).then((data) => {
      setTranslations(data);
    });
  }, [locale]);

  // 번역 함수
  const t = (key) => {
    if (!key) return "";
    return getNestedTranslation(translations, key) || key;
  };

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t, translations, loading }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// 훅: 번역 함수 및 상태 사용
export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation은 I18nProvider 내에서 사용해야 합니다");
  }
  return context;
}

// 지원되는 로케일 목록 내보내기
export { SUPPORTED_LOCALES };
