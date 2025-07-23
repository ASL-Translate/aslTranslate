import mysql from 'mysql2';
import path from 'path';
import { Hash_SHA256 } from './utils.js';

import dotenv from "dotenv";
dotenv.config();

const adminDB = mysql.createPool({
    host: 'localhost',
    user: process.env.ADM_DB_USER,
    password: process.env.ADM_DB_PASS,
    database: process.env.ADMIN_DB_NAME
}).promise();

const aslDB = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
}).promise();

console.log(`[*] db_user test : ${process.env.DB_USER} | if this shows "null" or "undefined" something is wrong!`);

//##############################################################
//      ASL DB INTERACTION
async function SearchWord(query, params) {
    const [rows] = await aslDB.query(query, params);
    return rows;
}

async function GetAslCards() {
    const [rows] = await aslDB.query(
        'SELECT id, word, hand_shape, location, palm_dir, hand_movement, face_expression FROM asl_words'
    );
    return rows;
}

async function CreateAslCard(data) {
    /*
    const data = {
                word,
                hand_shape,
                location,
                palm_dir,
                hand_movement,
                face_expression,
                path
            }
    */
    const insertCardQuery = `
    INSERT INTO asl_words (
        word, path, hand_shape, location, palm_dir, hand_movement, face_expression
    ) VALUES (?, ?, CAST(? AS JSON), CAST(? AS JSON), CAST(? AS JSON), CAST(? AS JSON), CAST(? AS JSON))
    `;

    const params = [
        data.word,
        data.path,
        JSON.stringify(data.hand_shape.split(',')),
        JSON.stringify(data.location.split(',')),
        JSON.stringify(data.palm_dir.split(',')),
        JSON.stringify(data.hand_movement.split(',')),
        JSON.stringify(data.face_expression.split(','))
    ];

    try {
        // check if there is already a card based off the data.word
        // if an entry exists drop this req.
        const [existing] = await aslDB.query(
            'SELECT * FROM asl_words WHERE word = ?',
            [data.word]
        );

        if (existing.length > 0) {
            console.log(`Card already exists for: ${data.word}`)
            return false;
        }

        // each card inserted is unique!
        // |____ each ASL sign points to one eng-word
        console.log("Attempting to Insert new Card. . .")
        await aslDB.query(insertCardQuery, params);
        console.log("|____Card Inserted Successfully!");
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// remove asl card based off given name
async function DeleteAslCard(word) {
    if (!word) {
        console.error("Word not Defined!");
        return false;
    }

    try {
        const deleteQuery = 'DELETE FROM asl_words WHERE word = ?';
        const [result] = await aslDB.query(deleteQuery, [word]);

        return result.affectedRows > 0;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function GetCardPath(word) {
    try {
        const findQuery = 'SELECT path FROM asl_words WHERE word = ?';
        const [result] = await aslDB.query(findQuery, [word]);

        if (result.length > 0) {
            return result[0].path;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function GetCardInfo(id) {
    try {
        const [rows] = await aslDB.query(
            'SELECT id, word, path, hand_shape, location, palm_dir, hand_movement, face_expression FROM asl_words WHERE id = ?',
            [id]
        );
        
        if (rows.length > 0) {
            let card = rows[0];
            card.path = path.basename(card.path);
            return card;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
        return false;
    }
}

// given data we find the entry based off data.word
// and modify its attributes based off data
async function ModifyAslCard(data) {
    const updateQuery = `
        UPDATE asl_words
        SET 
            path = ?,
            hand_shape = ?,
            location = ?,
            palm_dir = ?,
            hand_movement = ?,
            face_expression = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE word = ?
    `;

    if (data.path === "") {
        // get original path when none is provided
        data.path = await GetCardPath(data.word);
    }

    const params = [
        data.path,
        JSON.stringify(data.hand_shape.split(',')),
        JSON.stringify(data.location.split(',')),
        JSON.stringify(data.palm_dir.split(',')),
        JSON.stringify(data.hand_movement.split(',')),
        JSON.stringify(data.face_expression.split(',')),
        data.word
    ];

    try {
        const [result] = await aslDB.query(updateQuery, params);
        console.log(
            result.affectedRows === 1
                ? "ASL card updated successfully."
                : "No card found with the given word."
        );
        return (result.affectedRows === 1);
    } catch (error) {
        console.error("Error updating ASL card:", error);
        return false;
    }
}

//##############################################################
//      ADMIN DB INTERACTION
async function LoginUser(username, passHash) {
    const [rows] = await adminDB.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, passHash] // placeholders ensure user-controlled inputs are treated as data and not extension of the query
    );
    return rows;
}

async function GetAdmins() {
    const [rows] = await adminDB.query(
        'SELECT username FROM users'
    );
    return rows;
}

async function RegisterAdmin(username, password) {
    if (!username || !password) {
        return "Register Failed!";
    }

    try {
        // Check if admin already exists
        const [existing] = await adminDB.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existing.length > 0) {
            return "Failed to add Admin!";
        }

        console.log(`Attempting to add Admin: ${username}`);

        const hashed_passwd = Hash_SHA256(password);

        const [result] = await adminDB.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashed_passwd]
        );

        if (result.affectedRows === 1) {
            console.log("Admin Added Successfully!");
            return "Admin Added Successfully!";
        } else {
            console.log("Failed to add Admin!");
            return "Failed to add Admin!";
        }
    } catch (err) {
        console.error("Error in RegisterAdmin:", err);
        return "Failed to add Admin!";
    }
}

async function ResetAdminPassword(username, original, new_password) {
    if (!username || !original || !new_password) {
        console.error("Missing Values!");
        return "Password Reset Failed!";
    }

    try {
        console.log("Attempting to Reset Password. . .")

        // Check if admin exists
        const [existing] = await adminDB.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existing.length === 0) {
            console.error("User provided does not exist in DB!");
            return "Password Reset Failed!";
        }

        const new_hashed_passwd = Hash_SHA256(new_password);
        const ori_hashed_passwd = Hash_SHA256(original);

        // ensure the username:password credential matches when we UPDATE password
        const updateQuery = `UPDATE users SET password = ? WHERE (username = ? AND password = ?)`;
        const [result] = await adminDB.query(
            updateQuery,
            [new_hashed_passwd, username, ori_hashed_passwd]
        );

        if (result.affectedRows === 1) {
            console.log("Password Reset Successfully!");
            return "Password Reset Successfully!";
        } else {
            console.log("Password Reset Failed!");
            return "Password Reset Failed!";
        }
    } catch (err) {
        console.error("Error Resetting Password:", err);
        return "Password Reset Failed!";
    }
}

async function RemoveAdmin(adminUsername) {
    try {
        const [rows] = await adminDB.query(
            'SELECT * FROM users WHERE username = ?',
            [adminUsername]
        );

        if (rows.length === 0) {
            console.log("Issue Deleting Admin");
            return { acknowledge: false, message: "Error Deleting Admin!" };
        }

        const adminProfile = rows[0];

        if (adminProfile.isProtected) {
            console.log("Attempted to delete protected account");
            return { acknowledge: false, message: "Cannot delete administrator!" };
        }

        const [result] = await adminDB.query(
            'DELETE FROM users WHERE username = ?',
            [adminUsername]
        );

        if (result.affectedRows === 1) {
            console.log("Admin Deleted!");
            return { acknowledge: true, message: "Admin Deleted Successfully!" };
        } else {
            console.log("Issue Deleting Admin");
            return { acknowledge: false, message: "Error Deleting Admin!" };
        }
    } catch (err) {
        console.error("Error in RemoveAdmin:", err);
        return { acknowledge: false, message: "Error Deleting Admin!" };
    }
}

export { SearchWord, LoginUser, GetAdmins, RegisterAdmin, RemoveAdmin, ResetAdminPassword,
        CreateAslCard, ModifyAslCard, DeleteAslCard, GetAslCards,
        GetCardPath, GetCardInfo };