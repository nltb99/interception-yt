const jwt = require('jsonwebtoken');

async function authVerifyToken(req,res,next) {
    try {
        const authHeader = await req.headers['authorization'];
        if(!authHeader) return res.status(401).json({msg: 'Token must be provided'});
        const token = await authHeader.split(' ')[1];
        if(token === null) return res.status(401).json({msg: 'Token not found'});
        await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload) => {
            if(err) throw err;
            const {idEx} = payload;
            req.idEx = idEx;
            next();
        });
    } catch(e) {
        return res.status(400).json({msg: 'Invalid token'});
    }
}

async function resetVerifyToken(req,res,next) {
    try {
        const authHeader = await req.headers['authorization'];
        const token = (await authHeader) && authHeader.split(' ')[1];
        if(token === null) return res.sendStatus(401);

        await jwt.verify(token,process.env.RESET_TOKEN_SECRET,(err,payload) => {
            if(err) throw err;
            const {email,username} = payload;
            req.emailReset = email;
            req.usernameReset = username;
            next();
        });
    } catch(e) {
        return res.status(400).json({msg: 'Invalid token'});
    }
}

module.exports = {
    authVerifyToken,
    resetVerifyToken,
};
