const jwt = require('jsonwebtoken');
const userAuth = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.userData = decoded;
        next();
    }catch (err) {
        res.status(401).json(err)
    }
}

module.exports = userAuth;