const { getGPTResponse } = require("./api");
const {
  getLocaleFilePath,
  getFolderPath,
  readJsonFileSync,
  writeJsonFileSync,
  setNestedProperty,
  sanitizeKeyPath,
} = require("./util");

async function translate(project, word, nestedJsonKeyPath) {
  let resultJson = null;
  try {
    // 폴더 경로 가져오기
    const folderPath = getFolderPath(project);
    console.log(`번역 저장 경로: ${folderPath}`);

    // 키 경로 유효성 검사 및 정규화
    if (!nestedJsonKeyPath || typeof nestedJsonKeyPath !== "string") {
      console.error("유효하지 않은 키 경로:", nestedJsonKeyPath);
      nestedJsonKeyPath = "default";
    } else {
      // 경로 구분자(/, \) 제거 및 정규화
      nestedJsonKeyPath = sanitizeKeyPath(nestedJsonKeyPath);
    }

    console.log(`사용할 키 경로: ${nestedJsonKeyPath}`);

    // API 호출하여 번역 결과 가져오기
    resultJson = await getGPTResponse(word);

    // 번역 결과 유효성 검사
    if (
      !resultJson ||
      typeof resultJson !== "object" ||
      Object.keys(resultJson).length === 0
    ) {
      console.error("유효하지 않은 번역 결과:", resultJson);
      return null;
    }

    const resultJsonKeyValue = Object.entries(resultJson);

    // 각 언어별로 파일에 저장
    for (const [key, value] of resultJsonKeyValue) {
      try {
        const file = getLocaleFilePath(folderPath, key);
        console.log(`처리 중인 파일: ${file}`);

        // JSON 파일 읽기 (없으면 빈 객체 생성)
        let json = readJsonFileSync(file);

        // null 또는 undefined 값은 건너뛰기
        if (value === null || value === undefined) {
          console.warn(`${key} 언어에 대한 번역 값이 없습니다.`);
          continue;
        }

        // 번역된 내용 저장
        setNestedProperty(json, nestedJsonKeyPath, value);
        writeJsonFileSync(file, json);
        console.log(`${key} 언어 번역 완료: ${value}`);
      } catch (err) {
        console.error(`${key} 언어 처리 중 오류: ${err.message}`);
        continue;
      }
    }

    return resultJson;
  } catch (error) {
    console.error("번역 중 오류 발생:", error);
    return null;
  }
}

module.exports = {
  translate,
};
