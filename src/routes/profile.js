const express = require("express");
const profileRouter=express.Router();
const {userAuth} = require("../midileware/auth")
const {validateProfileEdit} = require("../utils/validate");
const validator= require("validator")




profileRouter.get("/profile/view",userAuth,async(req,res)=>{
     try{
           const userData=req.user;
           const responseUser={
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    about: userData.about,
                    skills: userData.skills,
                    photoUrl: userData.photoUrl,
           }

          res.json({
               status: 200,
               message: "Profile fetched successfully",
               data:responseUser, 
           });

     }catch(err){
          res.status(500).send(err.message || "Internal Server Error");
     }
   
    

})

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
     try{
         if(!validateProfileEdit(req.body)){
          return res.status(401).json({
               status:401,
               message:"Invalid fields for profile edit",
               data:null
          });
      }


         const loggedInUser = req.user;
         const updatedData=req.body;
       


         if(updatedData?.skills && (!Array.isArray(updatedData.skills) || updatedData.skills.length > 10)){
          // return res.status(400).send("Skills must be an array with a maximum of 10 items");
          return res.status(400).json({
               status:400,
               message:"Skills must be an array with a maximum of 10 items",
               data:null
          })
         }


         if(updatedData?.photoUrl && !validator.isURL(updatedData.photoUrl)){
           return res.status(400).json({
               status:400,
               message:"Invalid Photo URL",
               data:null
          })
         }


         Object.keys(updatedData)?.forEach((key)=>{loggedInUser[key]=updatedData[key]})

         await loggedInUser.save();

         res.json({
               status:200,
               message:"Profile Updated Successfully",
               data:loggedInUser
          })
         

     }catch(err){
          res.status(500).send(err.message || "Internal Server Error");
     }
})
module.exports = profileRouter;