const express = require('express');
const router = express.Router();
const path = require('path');
const mysql = require('mysql');
require('dotenv').config();



router.use(express.json());//바디파서는 익스프레스에 통합이되었기 때문에 이렇게 사용
router.use(express.urlencoded({ extends: true }));

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PW,
    database:process.env.DB_NAME,
    insecureAuth: true,  
});

router.get("/", (req, res) => {
    res.send("유저라우터 초기화면입니다.");
});

router.get("/join", (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', "join.html"));
});

router.post("/join", (req, res, next) => {
    const { uid, upw, uname, email } = req.body;
    console.log("받아온 아이디 : " + req.body.uid);

    connection.query(`SELECT * FROM user WHERE UserId = 'abc'`, (err, result) => {
        if(err){
            throw err;
        }else{
            console.log(result);
        }
    })
       
});
module.exports = router;