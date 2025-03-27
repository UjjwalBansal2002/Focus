const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res,next) => {
     try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token is not provided' });
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {

    }
}  

const generateToken = (userData) => {
    // console.log(userData);
    return jwt.sign(userData, process.env.JWT_SECRET);

}


module.exports = {jwtAuthMiddleware, generateToken};


