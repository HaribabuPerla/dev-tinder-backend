const mongoose=require("mongoose");  //Importing mongoose
const validator=require("validator")

if (mongoose.models.User) {
  delete mongoose.models.User;
}

//Creating a schema for the user model
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:20,
        trim:true,
    },
    lastName:{
        type:String,
        minLength:3,
        maxLength:20,
        trim:true,
    },
    emailId:{
        type:String,
        required:true,
        unique:[true,"Email already exists"],
        lowercase:true,
        trim:true,
        validate:(value) => {
          if(!validator.isEmail(value)){
            throw new Error("Invalid Email")
          }
        }
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        lowercase:true,
        validate:(value)=> {
          const validGenders=["male","female","others"]
          if(!validGenders.includes(value)){
            throw new Error("Invalid Gender")
          }
        
    },
  
    },
      photoUrl: {
    type: String,
    default: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740",
    validate(value) {
      if (!validator.isURL(value)) throw new Error("Invalid Photo URL");
    }
  },
    about:{
        type:String,
        maxLength:100,
        trim:true,
        default:"This is a default about me"
    },
    skills:{
      type:[String]
    }


},{ timestamps: true })


const User = mongoose.model("User",userSchema);
module.exports=User;