const express= require('express');
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
require("./config/database");
const dotenv=require("dotenv")
dotenv.config()





const app=express();
const port=7777; 

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
const authRouter =require("./routes/auth")
const profileRouter = require("./routes/profile");  
const userRouter = require("./routes/user");
const requestRouter=require("./routes/request");
const cors=require("cors");
const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-tinder-frontend-eight.vercel.app"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",userRouter);
app.use("/",requestRouter)


connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}) 

}).catch((err)=>{
    console.error("Database connection failed", err); 
}) 

// https://dev-tinder-backend-vbie.onrender.com