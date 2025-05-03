const path = require("path");
const fs = require("fs");
const express = require("express");

const { deleteKey } = require("./delete-key");
const { syncLocale } = require("./sync-locale");
const { translate } = require("./translator");
const { getFolderPath } = require("./util");
const app = express();

// 서버 시작 시 환경 체크
function checkEnvironment() {
  console.log("환경 검증 중...");

  // 예시 프로젝트 경로 확인
  const examplePath = getFolderPath("example-project");
  const fullPath = path.resolve(__dirname, examplePath);
  console.log(`example-project 경로: ${fullPath}`);

  // 경로가 존재하지 않으면 생성
  if (!fs.existsSync(fullPath)) {
    try {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`디렉토리 생성됨: ${fullPath}`);
    } catch (err) {
      console.error(`디렉토리 생성 실패: ${fullPath}`, err);
    }
  }

  console.log("환경 검증 완료!");
}

// 프로젝트 목록 가져오기
function getProjects() {
  // util.js의 getFolderPath 함수에서 지원하는 프로젝트 목록
  return ["example-project"];
}

// 초기 환경 검증 실행
checkEnvironment();

// 정적 파일을 서빙하기 위해 'public' 디렉토리를 사용
app.use(express.static("public"));

// POST 요청의 데이터를 파싱하기 위해 미들웨어 추가
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 표준 응답 형식 유틸리티 함수
const sendResponse = (res, status, message, data = null) => {
  const response = { status, message };
  if (data) response.data = data;
  return res.status(status).json(response);
};

// 루트 경로로 접속 시 index.html 파일을 서빙
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 프로젝트 목록 API 추가
app.get("/api/projects", (req, res) => {
  try {
    const projects = getProjects();
    sendResponse(res, 200, "프로젝트 목록을 성공적으로 가져왔습니다.", {
      projects,
    });
  } catch (error) {
    console.error("프로젝트 목록 조회 오류:", error);
    sendResponse(res, 500, "프로젝트 목록을 가져오는데 실패했습니다.");
  }
});

// POST 요청 처리
app.post("/translate", async (req, res) => {
  const { project, msg, key } = req.body;

  if (!project || !msg || !key) {
    return sendResponse(
      res,
      400,
      `필수 파라미터가 누락되었습니다. (project: ${project}, msg: ${msg}, key: ${key})`
    );
  }

  try {
    const ok = await translate(project, msg, key);
    if (ok) {
      sendResponse(res, 200, "번역이 완료되었습니다.");
    } else {
      sendResponse(res, 500, "번역에 실패했습니다.");
    }
  } catch (error) {
    console.error("번역 처리 오류:", error);
    sendResponse(res, 500, "번역 처리 중 오류가 발생했습니다.");
  }
});

app.post("/sync", async (req, res) => {
  const { project } = req.body;

  if (!project) {
    return sendResponse(res, 400, "필수 파라미터가 누락되었습니다. (project)");
  }

  try {
    const ok = await syncLocale(project);
    if (ok) {
      sendResponse(res, 200, "로케일 동기화가 완료되었습니다.");
    } else {
      sendResponse(res, 500, "로케일 동기화에 실패했습니다.");
    }
  } catch (error) {
    console.error("로케일 동기화 오류:", error);
    sendResponse(res, 500, "로케일 동기화 중 오류가 발생했습니다.");
  }
});

app.post("/delete", async (req, res) => {
  const { project, key } = req.body;

  if (!project || !key) {
    return sendResponse(
      res,
      400,
      `필수 파라미터가 누락되었습니다. (project: ${project}, key: ${key})`
    );
  }

  try {
    const ok = await deleteKey(project, key);
    if (ok) {
      sendResponse(res, 200, "키가 성공적으로 삭제되었습니다.");
    } else {
      sendResponse(res, 500, "키 삭제에 실패했습니다.");
    }
  } catch (error) {
    console.error("키 삭제 오류:", error);
    sendResponse(res, 500, "키 삭제 중 오류가 발생했습니다.");
  }
});

// 서버 포트 설정
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`서버가 시작되었습니다: http://localhost:${port}`);
});
