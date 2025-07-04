const mongoose = require('mongoose');

const connectDB = async()=>{
   await mongoose.connect("mongodb+srv://haribabu:Hari%409989768907@cluster0.l6onquh.mongodb.net/dev-tinder")
}
module.exports= connectDB;