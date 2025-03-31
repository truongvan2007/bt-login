const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken'); // You'll need to install this: npm install jsonwebtoken
require('dotenv').config()
var cors = require('cors');
var corsOptions = {
    origin: '*',
    credentials: true
};

// Secret key for JWT signing - in production, this should be in .env
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const users = [
    { id: 1, username: 'admin', password: '1' },
    { id: 2, username: 'user', password: '2' }
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
    const { username, password } = req.body;
    
    // Find user in the database
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Create JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username }, 
        JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
    );
    
    res.json({ 
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            username: user.username
        }
    });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is protected data', user: req.user });
});

// Get current user info
app.get('/user', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});