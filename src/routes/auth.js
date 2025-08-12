const express=require("express");
const authRouter=express.Router();
const User=require("../models/user");
const {validateUserObject, encryptPasswordHandler} = require("../utils/validate");
const validator = require("validator");

// Signup api
authRouter.post("/signup",async(req,res)=>{
  const userObj=req.body
 try{
    // validate the user object
    validateUserObject(userObj);

// Encryption of password
    const encryptPwd = await encryptPasswordHandler(userObj.password)
    const {firstName, lastName, emailId} = userObj;
   const userData={
     firstName,
     lastName,
     emailId,
     password: encryptPwd,
   }
        const user=  new User(userData);
   console.log("User object created:", user);
     await user.save();
     console.log("user saved successfully",user)
     res.send("User saved successfully");
   
  
    }
   catch(err){
       console.error("Error saving user:", err);
       res.status(400).send(err.message);
   }

})

// Login api
authRouter.post("/login",async(req,res)=>{
   try{
        const {emailId, password} = req.body;
        // Check if the request body is defined and contains emailId and password
        if(!(req.body && Object.keys(req.body)?.length > 0 && emailId && password)){
            return res.status(400).send("Please provide valid inputs");
        }
      
       const user = await User.findOne({emailId:emailId})
       if(!user){
              return res.status(404).send("User not found");
       }

         // Compare the provided password with the stored hashed password
        const passwordValid=await user.isValidPassword(password);
        if(!passwordValid){
            return res.json({status:401 ,message :"Invalid credentials"});
        }else{
            //  Jwt token
            const token = user.getJWT();
            if(!token){
               return res.status(401).send("Error generating token");
            }
         

            // send token to the user using cookies
             res.cookie("token",token)
const responseUser={
    firstName: user.firstName,
    lastName: user.lastName,
    about: user.about,
    skills: user.skills,
    photoUrl: user.photoUrl,
}

            // If the password is valid, send a success response
            res.json({
                status:200,
                success:true,
                message:"Login Successful",
                data:responseUser,


            });
        }

      
    
   }catch(err){
    res.status(500).send("Error during  login: " + err.message);
 }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expiresIn:new Date(Date.now())})
    res.json({
        status:200,
        message:"Logout successful",
        data:null
    })

});

authRouter.post("/forgotPassword",async(req,res)=>{
    const {emailId,updatePassword} = req.body;
    if(!emailId){
       return res.status(400).send("Please provide a valid emailId");
    }

    if(!validator.isEmail(emailId)){
     return res.status(400).send("Please provide a valid emailId");

    }
   
 const user= await User.findOne({emailId:emailId})
 if(!user){
    return res.status(400).send("User not found with provided emailId");
 }

 if(!updatePassword || !validator.isStrongPassword(updatePassword)){
    return res.status(400).send("Please provide strongpassword")
 }

const isSamePassword= await user.isValidPassword(updatePassword);
console.log("Is same password:", isSamePassword);
if(isSamePassword){
    return res.status(400).send("New password cannot be same as old password");
}

 const encryptPassword=await encryptPasswordHandler(updatePassword);
 user.password=encryptPassword;
 await user.save();
 res.send("Password updated successfully");

});

module.exports = authRouter;