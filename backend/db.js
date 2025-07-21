import mysql from 'mysql2';
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

export { SearchWord, LoginUser, GetAdmins, RegisterAdmin, RemoveAdmin };