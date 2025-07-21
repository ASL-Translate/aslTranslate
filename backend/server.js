import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import express from 'express';
import cors from 'cors';
import { Hash_SHA256, GenerateAdminJWT } from './utils.js';
import { SearchWord, LoginUser, GetAdmins, RegisterAdmin, RemoveAdmin } from './db.js';
const app = express();

import dotenv from "dotenv";
dotenv.config();

console.log(`[*] db_user test : ${process.env.DB_USER} | if this shows "null" or "undefined" something is wrong!`);

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

// Custom Error Handler to hide verbose errors from clients
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
});

// attempting to cover up digital foot-print
app.disable('x-powered-by');

// allow parsing of URL-encoded bodies in POST reqs
app.use(express.urlencoded({ extended: true }));
// allows for cookie usage
app.use(cookieParser());
// allow json parsing from POST
app.use(express.json());

app.get('/', (req, res) => {
    res.send("You've Reached the Back-End!\n");
});

//##############################################################
//      ASL DB INTERACTION
app.get('/search', async (req, res) => {
    const { word } = req.query; // /seach?word=hello
    let query = 'SELECT * FROM engwords WHERE 1=1';
    const params = [];
    if (word) {
        query += ' AND word LIKE ?';
        params.push(`%${word}%`);
    }
    try {
        const rows = await SearchWord(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error retrieving database entries:', error);
        res.status(500).send('Error retrieving database entries');
    }
});

//##############################################################
//      ADMIN DB INTERACTION
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const passwordHash = Hash_SHA256(password);

        console.log(`[*] Credential | ${username}:${passwordHash}`);

        const rows = await LoginUser(username,passwordHash);
    
        if (rows.length > 0) {
            console.log(`[*] ${username} access granted to Client-IP: ${req.ip}`);

            res.cookie('adm_asltranslate', await GenerateAdminJWT(username), {
                httpOnly: true,
                secure: false,           // set to true if using HTTPS
                sameSite: 'lax',         // or 'none' if cross-site and using HTTPS
                path: '/',
                maxAge: 24000 * 60 * 60  // 24 hours
            });

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
    const token = req.cookies.adm_asltranslate;

    // make sure the JWT is valid
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            // pull username from JWT and check if it exists in the DB
            return res.status(200).json({
                authenticated: true,
                username: validJWT.username
            });
        } catch {
            return res.status(401).json({ authenticated: false });
        }
    } else {
        return res.status(401).json({ authenticated: false });
    }
});

app.get('/admin/fetch_admins', async (req, res) => {
    const token = req.cookies.adm_asltranslate;

    // make sure the JWT is valid
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            // pull username from JWT and check if it exists in the DB
            const adm_list = await GetAdmins();
            console.log(`[*] ADMIN LIST: ${JSON.stringify(adm_list)}`)
            return res.status(200).json(adm_list);
        } catch {
            return res.status(401).json({});
        }
    } else {
        return res.status(401).json({});
    }
});

app.post('/admin/register', async (req, res) => {
    const token = req.cookies.adm_asltranslate;
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            const adminData = req.body;
            const regAdmin = await RegisterAdmin(adminData.username, adminData.password);
            res.send(regAdmin);
        } catch {
            res.send("Failed to add Admin!");
        }
    } else {
        res.send("Failed to add Admin!");
    }
});

app.post('/admin/remove_admin', async (req, res) => {
    const token = req.cookies.adm_asltranslate;
    const data = req.body;
    const validJWT = await DecodeAdminJWT(res, token);
    
    if (validJWT) {
        try {
            console.log("Admin Attmepting to Remove Admin: " + data.username)
            const action = await RemoveAdmin(data.username);
            return res.json(action);
        } catch {
            return res.json(null);
        }
    } else {
        return res.json(null);
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});