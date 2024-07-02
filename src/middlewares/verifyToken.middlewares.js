//@ts-check
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../constants.js';

const verifyToken = () => {
    return (req, res, next) => {
        // Extract the token from the Authorization header
        const authHeader = req.headers['authorization'];
        if(!authHeader) {
            return res.status(401).json({ msg: 'Please authenticate yourself' });
        }
    
        const token = authHeader.split(' ')[1];
    
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
    
        // Verify and decode the token
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid token' });
            }
    
            // Add the decoded user information to the request object
            req.user = user;
            next();
        });
    }
}


const restrictUser = (role) => {
    return (req, res, next) => {
        if(!req.user.role || req.user.role !== role) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        next();
    }
}

export { verifyToken, restrictUser }