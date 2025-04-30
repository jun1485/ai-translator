const fs = require("fs");
const path = require("path");

function getLocaleFilePath(folderPath, locale) {
  return path.join(__dirname, folderPath, `/${locale}.json`);
}

function getFolderPath(project) {
  let folder_path = "";

  switch (project) {
    case "wallet":
      folder_path = "../../apps/wallet/src/6_shared/i18n/locales";
      break;
    case "wrapping":
      folder_path = "../../apps/wrapping/src/6_shared/i18n/locales";
      break;
    case "dexing":
      folder_path = "../../apps/dexing/src/6_shared/i18n/locales";
      break;
    case "bitcoint-landing":
      folder_path = "../../apps/bitcoint_landing/src/6_shared/i18n/locales";
      break;
    case "explorer":
      folder_path = "../../apps/explorer/src/6_shared/i18n/locales";
      break;
    case "example-project":
      folder_path = "../../packages/example-project/src/i18n/locales";
      break;
    default:
      folder_path = "../../packages/example-project/src/i18n/locales";
  }

  return folder_path;
}

function readJsonFileSync(filepath, encoding = "utf8") {
  try {
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`디렉토리 생성됨: ${dir}`);
    }

    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, JSON.stringify({}, null, 2), encoding);
      console.log(`빈 JSON 파일 생성됨: ${filepath}`);
      return {};
    }

    const file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
  } catch (err) {
    console.log("🚀 ~ readJsonFileSync ~ err:", err);
    return {};
  }
}

function writeJsonFileSync(filepath, obj) {
  try {
    // 객체 유효성 검사
    if (!obj || typeof obj !== "object") {
      console.error("유효하지 않은 JSON 객체:", obj);
      obj = {}; // 기본값으로 빈 객체 사용
    }

    // 순환 참조 검사 및 제거
    const seen = new WeakSet();
    const sanitizedObj = JSON.parse(
      JSON.stringify(obj, (key, value) => {
        if (typeof value === "object" && value !== null) {
          if (seen.has(value)) {
            return "[Circular Reference]";
          }
          seen.add(value);
        }
        return value;
      })
    );

    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`디렉토리 생성됨: ${dir}`);
    }

    // 파일에 쓰기
    fs.writeFileSync(
      filepath,
      JSON.stringify(sanitizedObj, null, 2) + "\n",
      "utf-8"
    );
    console.log(`파일 저장됨: ${filepath}`);
  } catch (err) {
    console.error("파일 쓰기 오류:", err);
    throw err;
  }
}

function setNestedProperty(obj, path, value) {
  if (!path || typeof path !== "string") {
    console.warn("유효하지 않은 키 경로:", path);
    obj["default"] = value;
    return;
  }

  if (path.trim() === "") {
    obj["default"] = value;
    return;
  }

  const sanitizedPath = path.replace(/[^\w.]/g, "_");
  if (sanitizedPath !== path) {
    console.warn(`키 경로가 정제되었습니다: ${path} -> ${sanitizedPath}`);
  }

  const parts = sanitizedPath.split(".");
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i].trim();

    const key = part === "" ? "_" : part;

    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  const lastKey = parts[parts.length - 1].trim();
  const finalKey = lastKey === "" ? "_" : lastKey;

  current[finalKey] = value;
}

function hasNestedProperty(obj, path) {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (!current || !Object.prototype.hasOwnProperty.call(current, part)) {
      return false;
    }
    current = current[part];
  }
  return true;
}

/**
 * 키 경로를 정규화하는 함수
 * 파일 경로나 특수 문자가 포함된 경우 적절한 키로 변환
 */
function sanitizeKeyPath(keyPath) {
  if (!keyPath) return "default";

  // 파일 경로 패턴 확인 (C:\\Users\\... 또는 C:/Users/... 등)
  const isFilePath = /^[a-z][:][\\\/]|^\/|^\.\.?[\/\\]/i.test(keyPath);

  if (isFilePath) {
    // 파일 경로인 경우 파일명만 추출
    const fileName = path.basename(keyPath, path.extname(keyPath));
    return fileName || "default";
  }

  // 특수 문자 및 경로 구분자 제거
  const sanitized = keyPath
    .replace(/[\\\/]/g, "_") // 슬래시나 백슬래시를 언더스코어로 대체
    .replace(/[^a-zA-Z0-9_\.]/g, "") // 영문자, 숫자, 언더스코어, 점만 허용
    .replace(/^[^a-zA-Z_]+/, "") // 시작 부분이 문자나 언더스코어가 아니면 제거
    .replace(/\.{2,}/g, ".") // 연속된 점을 하나로 변환
    .replace(/^\.|\.$/g, ""); // 시작이나 끝의 점 제거

  return sanitized || "default";
}

const locales = [
  "en",
  "ko",
  "id",
  "cs",
  "da",
  "de",
  "es",
  "fr",
  "it",
  "hu",
  "nl",
  "nb",
  "pl",
  "pt",
  "ro",
  "fi",
  "sv",
  "vi",
  "tr",
  "ru",
  "uk",
  "el",
  "ar",
  "fa",
  "he",
  "hi",
  "bn",
  "th",
  "zh",
  "ja",
];

module.exports = {
  getLocaleFilePath,
  getFolderPath,
  readJsonFileSync,
  writeJsonFileSync,
  setNestedProperty,
  hasNestedProperty,
  sanitizeKeyPath,
  locales,
};
