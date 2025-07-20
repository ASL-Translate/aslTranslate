import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import { Hash_SHA256 } from './utils.js';
const app = express();

import dotenv from "dotenv";
dotenv.config();

const HOST = "127.0.0.1"
const PORT = process.env.REACT_APP_BACKEND_PORT;

const allowedOrigins = [
    `http://localhost:${process.env.REACT_APP_FRONTEND_PORT}`,                  // local dev
    `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_FRONTEND_PORT}`,   // LAN live frontend
];

console.log(`Allowed Origins\n|____ ${allowedOrigins}\n`);

app.use(cors({
    origin: allowedOrigins,  // React app origin
    credentials: true                // allow cookies
}));

const adminDB = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.ADMIN_DB_NAME
}).promise();

// Custom Error Handler to hide verbose errors from clients
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
});

// attempting to cover up digital foot-print
app.disable('x-powered-by');

// allow parsing of URL-encoded bodies in POST reqs
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("You've Reached the Back-End!\n");
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const passwordHash = Hash_SHA256(password);

        console.log(`[*] Credential | ${username}:${passwordHash}`);

        const [rows] = await adminDB.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, passwordHash] // placeholders ensure user-controlled inputs are treated as data and not extension of the query
        );
    
        if (rows.length > 0) {
            console.log(`[*] ${username} access granted to Client-IP: ${req.ip}`);
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error Authenticating');
    }
});

async function DecodeAdminJWT(res, token) {
    if (!token) {
        console.log("No Admin Token Found!");
        return null;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(`Admin Token for ${decoded.username} is valid!`);
        // { username, is_admin }
        return decoded;
    } catch (err) {
        console.error('Invalid Admin token:', err);
        ClearAdminCookie(res);
        return null;
    }
}

app.get('/admin/verify', async (req, res) => {
    const token = req.cookies.khi_adm_token;
    // make sure the JWT is valid
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            // pull username from JWT and check if it exists in the DB
            return res.json({
                authenticated: true,
                username: validJWT.username
            });
        } catch {
            return res.json({ authenticated: false });
        }
    } else {
        return res.json({ authenticated: false });
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});