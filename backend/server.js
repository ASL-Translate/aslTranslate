import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import express from 'express';
import fs from 'fs/promises';
import multer from 'multer';
import cors from 'cors';
import path from 'path';

import { Hash_SHA256, GenerateAdminJWT } from './utils.js';
import { LoginUser, GetAdmins, RegisterAdmin, RemoveAdmin, ResetAdminPassword,
        CreateAslCard, ModifyAslCard, DeleteAslCard, GetAslCards,
        GetCardPath, GetCardInfo } from './db.js';

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
    return res.status(500).json({ error: 'An unexpected error occurred.' });
});

// attempting to cover up digital foot-print
app.disable('x-powered-by');

// allow parsing of URL-encoded bodies in POST reqs
app.use(express.urlencoded({ extended: true }));
// allows for cookie usage
app.use(cookieParser());
// allow json parsing from POST
app.use(express.json());

// Serve files from 'src/uploads' when the URL starts with /uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`server.js dir -> ${__dirname} | static path -> ${path.join(__dirname, '../src/uploads')}`);
app.use('/uploads', express.static(path.join(__dirname, '../src/uploads')));

app.get('/', (req, res) => {
    return res.send("You've Reached the Back-End!\n");
});

//##############################################################
//      ASL DB INTERACTION

//----- PUBLIC END_POINTS
app.get('/asl/get_cards', async (req, res) => {
    try {
        const card_list = await GetAslCards();
        console.log(`[*] Card LIST: ${JSON.stringify(card_list)}`)
        return res.status(200).json(card_list);
    } catch (error) {
        console.error('Error retrieving database entries:', error);
        return res.status(401).json({});
    }
});

app.post('/asl/get_card', async (req, res) => {
    console.log(req.body);
    const id = req.body.id;

    try {
        const card = await GetCardInfo(id);
        console.log(`[*] Card : ${JSON.stringify(card)}`)
        return res.status(200).json(card);
    } catch (error) {
        console.error('Error retrieving database entries:', error);
        return res.status(401).json({});
    }
});

// clear the admin cookie
app.get('/logout', async (req, res) => {
    res.clearCookie('adm_asltranslate');
    return res.status(200).send("Logged Out");
});

//----- SPECIAL ADMIN CARD END_POINTS
app.post('/admin/asl/delete_card', async (req, res) => {
    const token = req.cookies.adm_asltranslate;
    const word = req.body.word;

    // make sure the JWT is valid
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            const originalPath = await GetCardPath(word);
            const r = await DeleteAslCard(word);
            if (r) {
                console.log("Admin Deleting asl card");

                console.log(`Deleting Linked File | ${originalPath}`);
                await fs.unlink(originalPath);

                return res.send("Successfully Deleted asl card");
            } else {
                console.log("No Card Deleted");
                return res.send("Failed to Delete asl card!");
            }
        } catch (error) {
            console.error('Error deleting card:', error);
            return res.send("Failed to Delete asl card!");
        }
    } else {
        console.error("Bad Admin Authenticated!");
        return res.send("Failed to Delete asl card!");
    }
});

// attempt to hide uploaded files through obfuscation
function ScrambleFileName(filename) {
    const hashed_filename = Hash_SHA256(filename);
    let new_filename = '';
    for (let i = 0; i < 16; i++) {
        const index = Math.floor(Math.random() * hashed_filename.length);
        new_filename += hashed_filename[index];
    }
    return `${new_filename}.gif`;
}

// Set up storage to preserve original filename
// on default multer uses checksum to name file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads'); // upload destination
    },
    filename: (req, file, cb) => {
        cb(null, ScrambleFileName(file.originalname)); // replace spaces for underscores
    }
});
const upload = multer({ storage: storage });

app.post('/admin/asl/create_card', upload.single('file'), async (req, res) => {
    const token = req.cookies.adm_asltranslate;
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            //################################################
            //          File Upload Handling
            console.log("Validating Uploaded File");
    
            // Multer puts file info on req.file
            const file = req.file;
            if (!file) {
                console.error("No File was Uploaded");
                return res.send('No file uploaded');
            }
    
            console.log("Uploaded file MIME type:", file.mimetype);
            console.log("Original filename:", file.originalname);
    
            // different browsers may change the mimetype
            const allowedMimeTypes = ['image/gif'];

            // deletes the bad file
            if (!allowedMimeTypes.includes(file.mimetype) || !file.originalname.endsWith('.gif')) {
                await fs.unlink(file.path); // Clean up
                console.error("|____Potential Malicious Upload Detected!");
                return res.send('Only .gif files are allowed');
            }
            //################################################

            //################################################
            //          Fields Handling
            const {
                word,
                hand_shape,
                location,
                palm_dir,
                hand_movement,
                face_expression,
                path=`${file.path}`
            } = req.body; // extract all text fields

            console.log("==== Finalized Card ====")
            const data = {
                word,
                hand_shape,
                location,
                palm_dir,
                hand_movement,
                face_expression,
                path
            };
            console.log(data);
            console.log("========================")

            // handle the card management in the DB
            const r = await CreateAslCard(data);

            //################################################
    
            if (r) {
                console.log("Admin creating new asl card");
                return res.send("Successfully added asl card");    
            } else {
                console.log("No Card Created");
                return res.send("Failed to add asl card!");
            }
        }  catch (error) {
            console.error("Error adding asl card:", error);
            return res.send("Failed to add asl card!");
        }
    } else {
        console.error("Bad Admin Authenticated!");
        return res.send("Failed to add asl card!");
    }
});

app.post('/admin/asl/edit_card', upload.single('file'), async (req, res) => {
    const token = req.cookies.adm_asltranslate;
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            //################################################
            //          Fields Handling
            const {
                word,
                hand_shape,
                location,
                palm_dir,
                hand_movement,
                face_expression,
                path=""
            } = req.body; // extract all text fields

            const data = {
                word,
                hand_shape,
                location,
                palm_dir,
                hand_movement,
                face_expression,
                path
            };

            //################################################

            //################################################
            //          File Upload Handling
            // if a file is not supplied do not worry about
            // updating the path attribute | otherwise remove
            // the old file from /uploads and update the path
    
            // Multer puts file info on req.file
            const file = req.file;
            if (!file) {
                console.log("No File was Uploaded");
                data.path = "";
            } else {
                // different browsers may change the mimetype
                const allowedMimeTypes = ['image/gif'];

                try {
                    // delete original file
                    const originalPath = await GetCardPath(data.word);
                    console.log(`Original Path | ${originalPath}`);
                    await fs.unlink(originalPath);

                    // deletes the bad file
                    if (!allowedMimeTypes.includes(file.mimetype) || !file.originalname.endsWith('.gif')) {
                        await fs.unlink(file.path); // Clean up
                        console.error("|____Potential Malicious Upload Detected!");
                        return res.send('Only .gif files are allowed');
                    }

                    data.path = file.path;
                    console.log(`Changed Path | ${originalPath} -> ${data.path}`);
                } catch (error) {
                    console.error("Error Editing asl card:", error);
                    return res.send("Failed to Edit asl card!");
                }

            }
    
            //################################################

            console.log("==== Finalized Modified Card ====")
            console.log(data);
            console.log("========================")
            
            // handle the card management in the DB
            const r = await ModifyAslCard(data);
    
            if (r) {
                console.log("Admin editing asl card");
                return res.send("Successfully Edited asl card");
            } else {
                console.log("No Card Edited");
                return res.send("Failed to Edit asl card!");
            }
        } catch (error) {
            console.error("Error Editing asl card:", error);
            return res.send("Failed to Edit asl card!");
        }
    } else {
        console.error("Bad Admin Authenticated!");
        return res.send("Failed to Edit asl card!");
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

            return res.send('Login successful');
        } else {
            return res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send('Error Authenticating');
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
        console.error("Bad Admin Authenticated!");
        return res.status(401).json({ authenticated: false });
    }
});

app.get('/admin/fetch_admins', async (req, res) => {
    const token = req.cookies.adm_asltranslate;

    // make sure the JWT is valid
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            const adm_list = await GetAdmins();
            console.log(`[*] ADMIN LIST: ${JSON.stringify(adm_list)}`)
            return res.status(200).json(adm_list);
        } catch {
            return res.status(401).json({});
        }
    } else {
        console.error("Bad Admin Authenticated!");
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
            return res.send(regAdmin);
        } catch {
            return res.send("Failed to add Admin!");
        }
    } else {
        console.error("Bad Admin Authenticated!");
        return res.send("Failed to add Admin!");
    }
});

app.post('/admin/reset_password', async (req, res) => {
    const token = req.cookies.adm_asltranslate;
    const validJWT = await DecodeAdminJWT(res, token);

    if (validJWT) {
        try {
            const passData = req.body;
            console.log(`Password Info: ${JSON.stringify(passData)}`);
            console.log(`Token Info: ${JSON.stringify(validJWT)}`);
            const resetPass = await ResetAdminPassword(
                validJWT.username,
                passData.original,
                passData.new
            );
            return res.send(resetPass);
        } catch {
            return res.send("Failed to add Admin!");
        }
    } else {
        console.error("Bad Admin Authenticated!");
        return res.send("Failed to add Admin!");
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
            console.error("Bad Admin Authenticated!");
            return res.json(null);
        }
    } else {
        return res.json(null);
    }
});

app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});