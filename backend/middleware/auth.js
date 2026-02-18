import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    // "Authorization: Bearer <token_string>"
    const authHeader = req.headers['authorization'];
    
    // take only <token_string>
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).send({ message: "Access Denied: No Token Provided" });
    }

    try {
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user info to the request object (defined from generateAccessToken() )
        req.user = verifiedUser;
        
        // pass to next routes
        next(); 
    } catch (err) {
        res.status(403).send({ message: "Invalid or Expired Token" });
    }
};