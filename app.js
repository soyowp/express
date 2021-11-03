const express = require("express");
const morgan = require("morgan"); //로그를 위한 morgan 모듈 추가
const cookie = require("cookie-parser"); //쿠키 생성을 위한 쿠키파서
const session = require("express-session"); // 세션 생성을 위한 익스프레스 세션
const multer = require("multer");
const path = require("path");


const userRouter = require("./routes/user");


//diskStorage로 파일명과 저장경로 세팅
const storage = multer.diskStorage({
  destination: "./uploads", //경로지정
  filename: (req, file, callback) => {
    let extension = path.extname(file.originalname); //파일확장자 표시해주기
    let basename = path.basename(file.originalname, extension); //원래 파일명 가져오기
    callback(null, basename + "-" + Date.now() + extension);
  },
});

const upload = multer(
  {
    storage: storage,
  },
  {
    filename: (req, file, cb) => {
      const fileName = new Date().valueOf() + path.extname(file.originalname);
      cb(null, fileName);
    },
  }
); //dset는 파일을 저장할 경로를 설정하는것
const app = express();
app.set("port", process.env.PORT || 3000); // app.set에 "port"라는 이름으로 3000 포트 설정
app.use("/user", userRouter);
app.use(express.json());//바디파서는 익스프레스에 통합이되었기 때문에 이렇게 사용
app.use(express.urlencoded({ extends: true }));
app.use(morgan("short")); // morgan 사용하기
app.use(
  session({
    httpOnly: true, //자바스크립트를 통해 세션 쿠키를 사용할 수 없다!
    secure: true, //https 환경에서만 session 정보를 사용하도록 처리
    secret: "secret key", //암호화하는 데 쓰일 키
    resave: false, //세션을 언제나 저장할지 설정
    saveUninitialized: true, //세션이 저장되기 전 uninitialized 상태로 미리 만들어 저장
    cookie: {
      //세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
      httpOnly: true,
      secure: true,
    },
  })
);
app.use((req, res, next) => {
  console.log(`모든 요청에 응답`);
  next();
});

app.get("/sessiontest", (req, res) => {
  console.log(`get 요청에만 응답`);
  res.sendFile(__dirname + "/index.html");
  req.session.user_id = "john"; //세션에 user_id를 john으로 설정
  req.session.name = "홍길동"; //세션에 name을 홍길동으로 설정
  console.log(req.session.name); // 홍길동이 출력됨
});

app.get("/", (req, res) => {
  console.log(`get 요청에만 응답`);
  res.sendFile(__dirname + "/multipart.html");
});

app.post("/upload/single", upload.single("myFile"), (req, res) => {
  //upload.single에 파라미터명을 일치
  console.log(req.body);
  console.log(req);
  res.render("upload");
  res.status(204).end();
  res.redirect("/upload");
});

app.post("/upload/multi", upload.array("myFiles"), (req, res) => {
  const { name } = req.body;
  console.log("데이터 : ", req.file);
  res.redirect("/");
});

app.post("/", (req, res) => {
  console.log(`post요청에만 응답`);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get("port"), () => {
  console.log("listening on port " + app.get("port"));
});
