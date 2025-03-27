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

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/login', (req, res) => {
    // sửa code ở đây


    res.json({ 
        message: 'Login successful', 
    });
});




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});