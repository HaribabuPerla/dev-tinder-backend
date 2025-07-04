const express= require('express');
const connectDB = require("./config/database");
const User=require("./models/user")
require("./config/database")

const app=express();
const port=7777; 

app.post("/signup",async(req,res)=>{
    const userObj={
        firstName:"Haribabu",
        lastName:"Perla",
        emailId:"hari@gmail.com",
        password:'hari1234',
   }

   const user= new User(userObj)

   try{
     await user.save();
     console.log("user saved successfully",user)
     res.send("User saved successfully");
   }
   catch{(err)=>{
       console.error("Error saving user:", err);
       res.status(400).send("Error saving user" + err.message);
   }}

})

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}) 

}).catch((err)=>{
    console.error("Database connection failed", err);
}) 

