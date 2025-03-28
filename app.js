const express = require('express');
const app = express();
const port = 3000;
// const { connectDB, sql } = require('./db');
require('dotenv').config()
var cors = require('cors');
var corsOptions = {
    origin: '*',
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
    const {username, password} = req.body;
    const checkUser = users.find(user => username == user.username && password == user.password);
    if (checkUser){
        res.json({ success: true, message: "Đăng nhập thành công", username });
    } else {
        res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
