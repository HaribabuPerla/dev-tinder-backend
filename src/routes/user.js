const express=require("express");
const userRouter=express.Router();
const User=require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../midileware/auth");


userRouter.get("/feed",userAuth,async(req,res)=>{
   
  try{
     const page=parseInt(req.query.page) || 1;
     let limit = parseInt(req.query.limit)||10;
     limit>50?50:limit
     const skip=(page - 1) * limit;

   
    const loggedInUser = req.user;
    // Fetching users who connected to the logged-in user
    const connectedUser=await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id},
            {toUserId:loggedInUser._id}
        ]
    }).select("fromUserId toUserId")

    const hiddenData=new Set()

    connectedUser.forEach((el)=>{
        hiddenData.add(el.fromUserId.toString());
        hiddenData.add(el.toUserId.toString())
    })

    const users=await User.find({
       $and : [{
        _id:{$nin:Array.from(hiddenData)}, // Exclude users already have some relationship with the logged-in user
        },
        {
        _id: { $ne: loggedInUser._id } // Exclude the logged-in user
        }
        ]
    }).select("firstName lastName photoUrl about skills")
      .skip(skip)
      .limit(limit)
    res.json({
        status: 200,
        success: true,
        message: "User feed fetched successfully",
        data: users
    });
    }catch(err){
        res.status(500).send("Error fetching users: " + err.message);
    }

})

userRouter.delete("/user", async(req,res)=>{
   const userId = req.body.id;
   try{
    const deletedUser=await User.findByIdAndDelete(userId)
    if(deletedUser){
        res.send("User deleted successfully");
    }else{
        res.status(404).send("User not found");
    }

   }catch(err){
         res.status(500).send("Error deleting user: " + err.message);
   }
})

userRouter.patch("/user",async(req,res)=>{

    const userId = req.query.id;
    const updateData=req.body


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

// pending action from who are send interested to logged in user
userRouter.get("/user/request/interested/recived",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        
        const pendingActions= await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId","firstName lastName -_id")

        res.json({
            status: 200,
            success: true,
            message: "Pending connection requests",
            data: pendingActions
        })

    }catch(err){
        res.status(500).json({
            status:500,
            success:false,
            message:err.message
        })
    }
})

// accepted connection who are accepted your interested connection
userRouter.get("/user/request/accepted/connections",userAuth,async(req,res)=>{

   try{
    const loggedInUser = req.user

     const acceptedConnections=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"accepted",
     }).populate("fromUserId","firstName lastName -_id")

     res.json({
        status:200,
        success:true,
        message:"accepted requests",
        data:acceptedConnections
     })

   }catch(err){
    res.json({
        status:500,
        success:false,
        message:err.message
    })

   }

    

    


})

module.exports=userRouter