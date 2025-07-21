import crypto from 'crypto'; // works only on backend!
import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
dotenv.config();

console.log(`[*] db_user test : ${process.env.DB_USER} | if this shows "null" or "undefined" something is wrong!`);

function Hash_SHA256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}

async function GenerateAdminJWT(username) {
    if (username === null) {
        return null;
    }

    // Payload can include user info
    const payload = {
        "username": username,
        "is_admin": true
    };
    
    // Options like token expiry
    const options = {
        expiresIn: '24h', // token expires in 24 hours
    };
    
    // Create the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, options);
    console.log(`Here's Your Admin JWT! ${token}`);
    return token;
}

export { Hash_SHA256, GenerateAdminJWT };