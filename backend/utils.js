import crypto from 'crypto'; // works only on backend!

function Hash_SHA256(input) {
    return crypto.createHash('sha256').update(input).digest('hex');
}
export { Hash_SHA256 };