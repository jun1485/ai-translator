const { getGPTResponse } = require("./api");
const fs = require("fs");
const path = require("path");
const {
  getLocaleFilePath,
  getFolderPath,
  readJsonFileSync,
  writeJsonFileSync,
  setNestedProperty,
} = require("./util");

async function translate(project, word, nestedJsonKeyPath) {
  try {
    // 폴더 경로 가져오기
    const folderPath = getFolderPath(project);
    console.log(`번역 저장 경로: ${folderPath}`);

    // API 호출하여 번역 결과 가져오기
    const resultJson = await getGPTResponse(word);
    const resultJsonKeyValue = Object.entries(resultJson);

    // 각 언어별로 파일에 저장
    for (const [key, value] of resultJsonKeyValue) {
      try {
        const file = getLocaleFilePath(folderPath, key);
        console.log(`처리 중인 파일: ${file}`);

        // JSON 파일 읽기 (없으면 빈 객체 생성)
        let json = readJsonFileSync(file);

        // 번역된 내용 저장
        setNestedProperty(json, nestedJsonKeyPath, value);
        writeJsonFileSync(file, json);
        console.log(`${key} 언어 번역 완료: ${value}`);
      } catch (err) {
        console.error(`${key} 언어 처리 중 오류: ${err.message}`);
        // 개별 언어 오류는 무시하고 계속 진행
        continue;
      }
    }

    return true;
  } catch (error) {
    console.error("번역 중 오류 발생:", error);
    return false;
  }
}

module.exports = {
  translate,
};
