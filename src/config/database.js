const mongoose = require('mongoose');


const connectDB = async()=>{ 
   await mongoose.connect(process.env.MONGO_DB_CONNECT)
}
module.exports= connectDB;