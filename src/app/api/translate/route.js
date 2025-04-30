import { translate } from "@local/translator/translator";
import { NextResponse } from "next/server";
import path from "path";

export async function POST(request) {
  try {
    const { text, keyPath } = await request.json();

    if (!text || !keyPath) {
      return NextResponse.json(
        { error: "텍스트와 키 경로가 필요합니다." },
        { status: 400 }
      );
    }

    const project = "ai translator";
    const result = await translate(project, text, keyPath);

    return NextResponse.json({ success: true, translations: result });
  } catch (error) {
    console.error("번역 API 오류:", error);
    return NextResponse.json(
      { error: "번역 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
