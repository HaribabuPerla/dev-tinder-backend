const express = require("express");
const profileRouter=express.Router();
const {userAuth} = require("../midileware/auth")
const {validateProfileEdit} = require("../utils/validate");


profileRouter.get("/profile/view",userAuth,async(req,res)=>{
     try{
           const userData=req.user;
    
     res.send(userData);

     }catch(err){
          res.status(500).send(err.message || "Internal Server Error");
     }
   
    

})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
     try{
         if(!validateProfileEdit(req.body)){
          return res.status(400).send("Invalid fields for profile edit");
      }


         const loggedInUser = req.user;
         const updatedData=req.body;
       


         if(updatedData?.skills && (!Array.isArray(updatedData.skills) || updatedData.skills.length > 10)){
          return res.status(400).send("Skills must be an array with a maximum of 10 items");
         }
           console.log("Updated Data:", updatedData, "Logged In User:", loggedInUser);

         if(updatedData?.photoUrl && !validator.isURL(updatedData.photoUrl)){
          return res.status(400).send("Invalid Photo URL");
         }
          console.log("Updated Data:", updatedData, "Logged In User:", loggedInUser);

         Object.keys(updatedData)?.forEach((key)=>{loggedInUser[key]=updatedData[key]})

         await loggedInUser.save();

         res.send("Profile updated successfully");

     }catch(err){
          res.status(500).send(err.message || "Internal Server Error");
     }
})
module.exports = profileRouter;