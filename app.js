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

const path = require('path'); // Add path if not already imported
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    //res.send('Hello World!');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.post('/login', (req, res) => {
//     // sửa code ở đây


//     res.json({ 
//         message: 'Login successful', 
//     });
// });

app.post('/login', (req, res) => {
    const { username, password, remember } = req.body;

    // 1. Find user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // 2. User found - Prepare the cookie
        // Store username directly in the cookie. NOTE: Not HttpOnly because welcome.html needs to read it.
        // This is less secure than server-side sessions.
        const cookieName = 'loggedInUser';
        const cookieValue = encodeURIComponent(user.username); // Ensure username is safe for cookie value
        let cookieAttributes = `Path=/`; // Apply cookie to the whole site
        // 3. Handle "Remember Me"
        if (remember) {
            const sevenDaysInSeconds = 7 * 24 * 60 * 60;
            cookieAttributes += `; Max-Age=${sevenDaysInSeconds}`; // Set persistent cookie
        } else {
            // No Max-Age means it's a session cookie (deleted when browser closes)
        }

        // 4. Set the cookie header manually
        // Example: Set-Cookie: loggedInUser=admin; Path=/; Max-Age=604800
        res.setHeader('Set-Cookie', `${cookieName}=${cookieValue}; ${cookieAttributes}`);

        console.log(`Set cookie for user: ${user.username}. Remember: ${!!remember}`);

        // 5. Send success response
        res.json({
            message: 'Login successful',
            // Optionally send username if needed immediately by index.html,
            // but welcome.html will rely on the cookie.
            // username: user.username
        });

    } else {
        // 6. User not found or password incorrect
        res.status(401).json({ message: 'Invalid username or password' });
    }
    // -------- END OF MODIFICATION --------

    // Remove the original placeholder response:
    // res.json({
    //     message: 'Login successful',
    // });
});


// Logout Route
app.post('/logout', (req, res) => {
    // To logout, we tell the browser to expire the cookie immediately
    const cookieName = 'loggedInUser';
    // Set Max-Age to 0 or a past date
    res.setHeader('Set-Cookie', `${cookieName}=; Path=/; Max-Age=0`);
    res.json({ message: 'Logout successful' });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
