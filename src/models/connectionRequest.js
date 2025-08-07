const express = require("express"); 
const mongoose = require("mongoose");


// Creating a schema for connection requests
const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
     },
     toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
         ref:"User"
     },
     status:{
        type:String,
        enum:{
         values:["interested","ignored","accepted","rejected"],
         message:`{VALUE} is not a valid status`,
      },
       required:true

     }


},{timestamps:true})

// checking before saving the data
connectionRequestSchema.pre("save",function(next){
   const connectionRequest=this;
   console.log("Connection Request Data:", connectionRequest);
   // checking from userId and toUserId are not same
   if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
       throw new Error("From and To user cannot be the same");
   }
   next();
})

// here we are telling mongoose to create a model named "connectionRequest"
//  using the connectionRequestSchema
const ConnectionRequest= mongoose.model("connectionRequest",connectionRequestSchema)
module.exports= ConnectionRequest;