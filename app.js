const express = require('express');
const app = express();
const port = 3000;
// const { connectDB, sql } = require('./db');
require('dotenv').config()
var cors = require('cors');
var corsOptions = {
    origin: ['http://localhost:5500'], // Allow both origins
    // origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Allow both origins
    credentials: true
};
app.use(cors(corsOptions));

// Dummy user data for authentication
const users = [
    { username: 'admin', password: '1' },
    { username: 'user', password: '2' },
    { username: 'minhthu', password: '3' }
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
    const { username, password, remember } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {  
        const cookieName = 'loggedIn';
        const cookieValue = encodeURIComponent(user.username);
        // let cookieAttributes = `Path=/; SameSite=None; Secure`; // For HTTPS, use Secure attribute
        let cookieAttributes = ``;

        if (remember) {
            const oneHour = 60 * 60; // 1 hour in seconds
            cookieAttributes += `; Max-Age=${oneHour}`;
        }
        res.setHeader('Set-Cookie', `${cookieName}=${cookieValue}; ${cookieAttributes}`);

        res.status(200).json({ message: 'OK' });
    }
    else {
        res.status(401).json({ message: 'NOK' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
