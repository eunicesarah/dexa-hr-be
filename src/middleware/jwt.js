const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET

function generateToken(user){
    return jwt.sign({id: user.id, email: user.email, role: user.role}, secret, {expiresIn: process.env.JWT_EXPIRES});
}

function verifyToken(token){
    try {
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        return jwt.verify(token, secret);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

function getTokenInfo(token) {
    try {
        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }
        return jwt.decode(token);
    } catch (error) {
        throw new Error('Invalid token');
    }
}

module.exports = { generateToken, verifyToken, getTokenInfo };