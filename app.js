const express = require('express');
const app = express();
const port = 3000;
// const { connectDB, sql } = require('./db');
require('dotenv').config()
var cors = require('cors');
var corsOptions = {
    origin: 'http://localhost:5500',
    credentials: true
};

const users = [
    { username: 'admin', password: '1' },
    { username: 'user', password: '2' }
];
// Built-in middleware to parse JSON bodies
app.use(express.json());

// Built-in middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/login', (req, res) => {
    const {username, password, rememberMe} = req.body;
    const checkUser = users.find(user => username == user.username && password == user.password);
    if (checkUser){
        const timeLive = rememberMe ? `;Max-Age=24*60*60` : '';
        res.setHeader('Set-Cookie', `remembered_user=${username};Path=/`+timeLive);
        res.json({ success: true, message: "Đăng nhập thành công", username });
    } else {
        res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
