// 지원 언어 목록
const supportedLanguages = [
  { code: "ko", name: "한국어" },
  { code: "en", name: "영어" },
  { code: "ja", name: "일본어" },
  { code: "zh-CN", name: "중국어(간체)" },
  { code: "zh-TW", name: "중국어(번체)" },
  { code: "vi", name: "베트남어" },
  { code: "id", name: "인도네시아어" },
  { code: "th", name: "태국어" },
  { code: "de", name: "독일어" },
  { code: "es", name: "스페인어" },
  { code: "fr", name: "프랑스어" },
  { code: "it", name: "이탈리아어" },
  { code: "pt", name: "포르투갈어" },
  { code: "ru", name: "러시아어" },
  { code: "ar", name: "아랍어" },
  { code: "hi", name: "힌디어" },
  { code: "bn", name: "벵골어" },
  { code: "nl", name: "네덜란드어" },
  { code: "pl", name: "폴란드어" },
  { code: "tr", name: "터키어" },
  { code: "uk", name: "우크라이나어" },
];

// API 호출 함수들

/**
 * 번역 API 호출 함수
 * @param {string} project - 프로젝트명
 * @param {string} message - 번역할 메시지
 * @param {string} key - 번역 키
 * @returns {Promise<Object>} - API 응답 데이터
 */
async function callTranslateAPI(project, message, key) {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project, message, key }),
    });

    return await response.json();
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
}

/**
 * 동기화 API 호출 함수
 * @param {string} project - 프로젝트명
 * @returns {Promise<Object>} - API 응답 데이터
 */
async function callSyncAPI(project) {
  try {
    const response = await fetch("/api/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project }),
    });

    return await response.json();
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
}

/**
 * 삭제 API 호출 함수
 * @param {string} project - 프로젝트명
 * @param {string} key - 삭제할 키
 * @returns {Promise<Object>} - API 응답 데이터
 */
async function callDeleteAPI(project, key) {
  try {
    const response = await fetch("/api/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project, key }),
    });

    return await response.json();
  } catch (error) {
    console.error("API 호출 오류:", error);
    throw error;
  }
}

// 유틸리티 함수들

/**
 * 로딩 메시지 HTML 생성
 * @param {string} message - 표시할 메시지
 * @returns {string} - 로딩 메시지 HTML
 */
function getLoadingMessage(message) {
  return `
    <div class="flex items-center gap-3 text-gray-400">
      <div class="animate-spin">
        <i class="fas fa-circle-notch"></i>
      </div>
      <span>${message}</span>
    </div>
  `;
}

/**
 * 성공 메시지 HTML 생성
 * @param {string} message - 표시할 메시지
 * @returns {string} - 성공 메시지 HTML
 */
function getSuccessMessage(message) {
  return `
    <div class="flex gap-3 items-start text-green-400">
      <div class="mt-1">
        <i class="fas fa-check-circle"></i>
      </div>
      <div>${message}</div>
    </div>
  `;
}

/**
 * 오류 메시지 HTML 생성
 * @param {string} message - 표시할 메시지
 * @returns {string} - 오류 메시지 HTML
 */
function getErrorMessage(message) {
  return `
    <div class="flex gap-3 items-start text-red-400">
      <div class="mt-1">
        <i class="fas fa-exclamation-circle"></i>
      </div>
      <div>${message}</div>
    </div>
  `;
}
