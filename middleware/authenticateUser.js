const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({error: 'Access denied. No token provided'});
    }
    try {
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log(decoded);
        next();
        }catch (error) {
            res.status(401).json({error: 'Invalid token.'})
        }
}

module.exports = authenticateUser;