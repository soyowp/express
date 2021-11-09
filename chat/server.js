const express = require('express');
const path = require('path');
const cookie = require('cookie');
const session = require('express-session');
const bodyParser = require('body-parser');
const socket = require('socket.io');
const morgan = require('morgan');
const app = express();
const port=3000;
const http= require('http');
const { json } = require('body-parser');
const database = require('mime-db');
const server = http.createServer(app);

const io = socket(server);
app.use(morgan('dev'));
app.use(session({
    secret: "sec",
    resave : false,
    saveUninitialized : true,
    }))
app.use(express.json());
app.use(express.urlencoded({extensions:true}));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './login.html'));
}).post('/login', (req, res) => {
    req.session.uid = req.body.id;
    res.redirect('/chat');
})



app.get('/chat' ,(req, res)=>{
    console.log(req.session);
    let uid = req.session.id;
    res.sendFile(path.join(__dirname, './chat.html'));
    
}).post('/chat', (req, res) => { 
    const uid = req.session.uid.toString();
    const say = req.body.say;
    const result = uid + ":" + say;
    res.send(result);
    
});

server.listen(port, ()=>{
    console.log(`${port} 로 서버 연결...`);
});