const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET;

function loginMiddleware(req, res, next){
    const authorization = req.headers.authorization;

    if(!authorization){
        return res.status(403).json({
            message: "Authorization header is missing"
        })
    }
    
    const words = authorization.split(' ');
    const token = words[1];

    try{
        const decoded = jwt.verify(token, SECRET);
        if(decoded.username){
            req.user = decoded;
            next();
        }
    }
    catch(error){
        console.log(error);
        res.status(403).json({
            message: "Authentication Unsuccesful"
        });
    }
}

module.exports = loginMiddleware;
