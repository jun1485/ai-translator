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
      console.warn(`디렉토리 생성 실패: ${fullPath}`);
      console.error(err);
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

// 루트 경로로 접속 시 index.html 파일을 서빙
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 프로젝트 목록 API 추가
app.get("/api/projects", (req, res) => {
  try {
    const projects = getProjects();
    res.json({ status: 200, projects });
  } catch (error) {
    console.error("프로젝트 목록 조회 오류:", error);
    res.json({
      status: 500,
      message: "프로젝트 목록을 가져오는데 실패했습니다.",
    });
  }
});

// POST 요청 처리
app.post("/translate", async (req, res) => {
  const { project, msg, key } = req.body;
  console.log("🚀 ~ app.post ~ project, msg, key:", project, msg, key);

  try {
    const ok = await translate(project, msg, key);
    if (ok) {
      res.send({ status: 200, message: `Complete!` });
    } else {
      res.send({ status: 500, message: `Failed!` });
    }
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error);

    res.send({ status: 500, message: `Failed!` });
  }
});

app.post("/sync", async (req, res) => {
  const { project } = req.body;
  console.log("🚀 ~ app.post ~ project:", project);
  try {
    const ok = await syncLocale(project);
    if (ok) {
      res.send({ status: 200, message: `Complete!` });
    } else {
      res.send({ status: 500, message: `Failed!` });
    }
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error);

    res.send({ status: 500, message: `Failed!` });
  }
});

app.post("/delete", async (req, res) => {
  const { project, key } = req.body;
  console.log("🚀 ~ app.post ~ project, key:", project, key);
  try {
    const ok = await deleteKey(project, key);
    if (ok) {
      res.send({ status: 200, message: `Complete!` });
    } else {
      res.send({ status: 500, message: `Failed!` });
    }
  } catch (error) {
    console.log("🚀 ~ app.post ~ error:", error);
    res.send({ status: 500, message: `Failed!` });
  }
});

// 서버 포트 설정
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
