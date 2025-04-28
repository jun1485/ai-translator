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
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`디렉토리 생성됨: ${dir}`);
    }

    fs.writeFileSync(filepath, JSON.stringify(obj, null, 2) + "\n", "utf-8");
    console.log(`파일 저장됨: ${filepath}`);
  } catch (err) {
    console.error("파일 쓰기 오류:", err);
    throw err;
  }
}

function setNestedProperty(obj, path, value) {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== "object") {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  current[parts[parts.length - 1]] = value;
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
  locales,
};
