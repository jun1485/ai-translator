// API 키는 환경 변수로 관리합니다.
require("dotenv").config();

// 환경 변수에서 API 키 가져오기
const API_KEY = process.env.OPENAI_API_KEY;

// API 키가 없으면 경고 메시지 출력
if (!API_KEY) {
  console.warn("⚠️ 경고: OPENAI_API_KEY가 설정되지 않았습니다.");
  console.warn(
    "프로젝트 루트에 .env 파일을 생성하고 OPENAI_API_KEY=your_api_key를 추가하세요."
  );
}

module.exports = {
  API_KEY,
};
