const jwt = require("jsonwebtoken");
const { User } = require("../db/user");
require('dotenv').config();

const SECRET = process.env.SECRET;

async function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(401).json({
            message: "Unauthorized - Missing Token"
        })
    }
    const [bearer, jwtToken] = token.split(" ");
    if(bearer!=="Bearer" || !jwtToken) {
        return res.status(401).json({
            message: "Unauthorized - Bad Token"
        })
    }
    try {
        const decoded = jwt.verify(jwtToken, SECRET);
        
        const user = await User.findOne({
            _id: decoded._id
        });

        if (user.userName && user.userName === req.params.username) {
            next();
        } else {
            return res.status(403).json({ error: 'Forbidden - Invalid username in token' });
        }
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized - Token has expired' });
          } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Unauthorized - Invalid token' });
          } else {
            return res.status(500).json({ error: 'Internal Server Error' });
          }
    }
}

module.exports = { userMiddleware };