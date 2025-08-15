const express=require("express");
const requestRouter=express.Router();
const {userAuth} = require("../midileware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User=require("../models/user");

// request send api call
requestRouter.post("/request/:status/:userId",userAuth,async(req,res)=>{

    try{
            const fromUserId = req.user._id;
    const toUserId = req.params.userId;
    const status = req.params.status;
    const acceptedStatus=["ignored","interested",];

    // Status checker
    if(!acceptedStatus.includes(status)){
      return res.status(400).json({
        status:400,
        message:"Invalid status provided",
        data:null
       })
    }
    // checking to user is there or not
    const connectionSendUser= await User.findById(toUserId)
   if(!connectionSendUser){
        return res.status(400).json({
        status:400,
        message:"Connection user not found",
        data:null
       })
   }

   const existingRequest= await ConnectionRequest.find({
    $or:[
    {fromUserId,toUserId,},
    {fromUserId:toUserId, toUserId:fromUserId}
   ]});
   console.log(existingRequest, existingRequest?.length> 0,existingRequest[0]?.status,status, existingRequest[0]?.status === status);
   const statusCheck=existingRequest?.length>0 && existingRequest?.filter((el)=>el.status==status).length
   if(existingRequest?.length> 0 && statusCheck){
 
     return res.status(400).json({
        status:400,
        message:`${status}  request already sent`,
        data:null
       })
   }
 
    const data=new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    })

    await data.save()
    res.status(200).json({
        status:200,
        message:`${req.user.firstName} send ${status} connection request to ${connectionSendUser.firstName}`,
        data:null
       })

    }catch(err){
        console.error("Error processing request:", err);
        return res.status(500).json({
            status:500,
            message:res?.message || "Something went wrong"

        })
        
    }


})

// request accept or reject api call
// request id means connection__id

requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
   try{
    const loggedInUser = req.user;
    const requestId=req.params.requestId;
    const status = req.params.status;
    const toUserId=loggedInUser._id;
    
    const acceptedStatus=["accepted","rejected"];

    const validStatus=acceptedStatus.includes(status);
    if(!validStatus){
        return res.status(400).send(status + " status is invalid");
    }

    // checking if the requestId is valid and belongs to the logged in user
    let connectionRequest= await ConnectionRequest.find({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested",
    })
    console.log("Connection Request:", connectionRequest);
    if(!connectionRequest || connectionRequest.length == 0){
        return res.status(404).send("Connection request not found or already processed");
    }
    if(connectionRequest.length == 1){
        connectionRequest = connectionRequest[0];
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({status : 200 ,message:`${loggedInUser.firstName} has ${status} the connection request`, data});

    }else{
        res.status(400).send("Multiple connection requests found, please check the request ID");
    }
    
    
    

   }catch(err){
     return res.status(500).send(err.message)
   } 
})

module.exports=requestRouter;