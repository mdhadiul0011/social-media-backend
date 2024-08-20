const jwt = require("jsonwebtoken");

exports.authuser = async (req, res, next)=> {
    try {
        const tmpToken = req.header("Authorization");
        const token = tmpToken && tmpToken.slice(7, tmpToken.length);
        console.log("token==>", token)
        
        if(!token) {
            return res.status(400).json({
                message: "Invalid Token"
            })
        }

        jwt.verify(token, process.env.SECRET_TOKEN_PASS, (err, user)=>{
        console.log("env==>", process.env.SECRET_TOKEN_PASS)
        
            if(err){
                return res.status(400).json({
                    message: "Invalid Authorization"
                })
            }
        req.user = user
        next();
        }) 

        
    } catch (error) {
        console.log(error);
        return  res.status(400).json({
            message: "Invalid User"
        })
    }
}

