import { NextResponse } from "next/server";
import { translate, initializeTranslator } from "@local/translator";
import path from "path";
import fs from "fs-extra";

// OPENAI_API_KEY는 배포 환경에서는 환경변수로 설정해주세요
const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY || "여기에_OpenAI_API_키를_입력하세요";
const LOCALES_DIR = path.join(process.cwd(), "public", "locales");

// 초기화 함수 실행
initializeTranslator(OPENAI_API_KEY, LOCALES_DIR);

export async function POST(request) {
  try {
    const { text, keyPath } = await request.json();

    if (!text || !keyPath) {
      return NextResponse.json(
        { error: "텍스트와 키 경로가 필요합니다." },
        { status: 400 }
      );
    }

    const result = await translate(text, keyPath, LOCALES_DIR);

    return NextResponse.json({ success: true, translations: result });
  } catch (error) {
    console.error("번역 API 오류:", error);
    return NextResponse.json(
      { error: "번역 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
