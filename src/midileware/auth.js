const Jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async(req, res, next) => {
    try{

    
    const {token}=req.cookies;
    if(!token || token?.length<=6){
        return res.status(401).json({
            status: 401,
            message: "Please login to continue"
        })
    }
     

    const decodedToken = Jwt.verify(token, "DEV_TINDER_SECRET_KEY");
    if(!decodedToken || !decodedToken._id){
        return res.status(401).send("Unauthorized: Invalid token");
    }

    const {_id} = decodedToken;
    const user= await User.findById(_id);
    if(!user){
        return res.status(404).send("User not found");
    }
    req.user = user;
    next()
}catch(err){

    res.status(500).send(err.message || "Internal Server Error");
  }


}

module.exports={userAuth}