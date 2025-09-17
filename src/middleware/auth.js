const { verifyToken } = require('./jwt');

const ROLES = {
    ADMIN: 'ADMIN',
    EMPLOYEE: 'EMPLOYEE'
};

function authentication(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

function authorize(role) {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (userRole !== role) {
            return res.status(403).json({ 
                message: 'Access denied. Insufficient permissions.' 
            });
        }
        next();
    };
}

function authAdmin(req, res, next) {
    return authorize(ROLES.ADMIN)(req, res, next);
}

function authEmployee(req, res, next) {
    return authorize(ROLES.EMPLOYEE)(req, res, next);
}

module.exports = { 
    authentication, 
    authorize, 
    authAdmin, 
    authEmployee,
    ROLES 
};