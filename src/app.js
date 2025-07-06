const express= require('express');
const connectDB = require("./config/database");
const User=require("./models/user")
require("./config/database")

const app=express();
const port=7777; 

app.use(express.json()); // Middleware to parse JSON bodies

app.post("/signup",async(req,res)=>{
  const userObj=req.body
  const validate=Object.values(userObj)?.every(value=>value?.length>0)

   

   try{
    if(validate){
        const user=  new User(userObj)
   console.log("User object created:", user);
     await user.save();
     console.log("user saved successfully",user)
     res.send("User saved successfully");
   }
    else{
      res.status(400).send("Some values are not valid or empty");
    }
    }
   catch(err){
       console.error("Error saving user:", err);
       res.status(400).send("Error saving user" + err.message);
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
        const allowedUpdateFields=["firstName", "lastName", "password", "age", "photoUrl", "about"];
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

connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}) 

}).catch((err)=>{
    console.error("Database connection failed", err); 
}) 

