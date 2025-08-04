const express= require('express');
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const User=require("./models/user")
const bcrypt = require("bcrypt");
require("./config/database");
const {validateUserObject,encryptPasswordHandler} = require("./utils/validate");
const jwt= require("jsonwebtoken");
const {userAuth} = require("./midileware/auth");



const app=express();
const port=7777; 

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.post("/signup",async(req,res)=>{
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
app.get("/feed",async(req,res)=>{
   
  try{
    //find is a method to get all the users from mongoose
        const users= await User.find({}) 
       if(users?.length > 0){
          res.send(users)
       }else{
         res.status(404).send("No users found");
       }
    }catch(err){
        res.status(500).send("Error fetching users: " + err.message);
    }

})

app.delete("/user", async(req,res)=>{
   const userId = req.body.id;
   try{
    const deletedUser=await User.findByIdAndDelete(userId)
    console.log(deletedUser)
    if(deletedUser){
        res.send("User deleted successfully");
    }else{
        res.status(404).send("User not found");
    }

   }catch(err){
         res.status(500).send("Error deleting user: " + err.message);
   }
})

app.patch("/user",async(req,res)=>{
    console.log("Update request received",req.query,req.body);

    const userId = req.query.id;
    const updateData=req.body
    console.log("Uupdate:", updateData);


    try{
     if(userId){
        const allowedUpdateFields=["firstName", "lastName", "password", "age", "photoUrl", "about","skills"];
        const validUpdtes=Object.keys(updateData).every(key=>allowedUpdateFields.includes(key));
        if(!validUpdtes){
            return res.status(400).send("Invalid update fields");
        }else{

        const updateUser=await User.findByIdAndUpdate(userId,updateData,{returnDocument:"after"})
        if(updateUser){
            res.send("User updated successfully");
        }else{
            res.status(404).send("User not found");
        }
    }  
    }else{
        res.status(400).send("User ID is required for update");
    }

    }catch(err){
        res.status(500).send("Error updating user: " + err.message);
    }
})
app.get("/profile",userAuth,async(req,res)=>{
   
     const userData=req.user;
     res.send(userData);

})
app.post("/login",async(req,res)=>{
   try{
        const {emailId, password} = req.body;
        // Check if the request body is defined and contains emailId and password
        if(!(req.body && Object.keys(req.body)?.length > 0 && emailId && password)){
            return res.status(400).send("Please provide valid inputs");
        }
      
       const user = await User.findOne({emailId:emailId});
       if(!user){
              return res.status(404).send("User not found");
       }

         // Compare the provided password with the stored hashed password
        const passwordValid=await user.isValidPassword(password);
        if(!passwordValid){
            return res.status(401).send("Invalid credentials");
        }else{
            //  Jwt token
            const token = user.getJWT();
            if(!token){
                res.status(401).send("Error generating token");
            }
         

            // send token to the user using cookies
             res.cookie("token",token)

            // If the password is valid, send a success response
            res.send("Login successful");
        }
      
    
   }catch(err){
    res.status(500).send("Error during login: " + err.message);
 }
})

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}) 

}).catch((err)=>{
    console.error("Database connection failed", err); 
}) 

