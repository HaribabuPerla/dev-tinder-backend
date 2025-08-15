const bcrypt = require("bcrypt");
const validator = require("validator");

const validateUserObject =  (userObj,res) => {
  const{firstName, lastName, emailId, password}=userObj;
  if(!(firstName && firstName.length > 3)){
    res.status(400).json({
      status:400,
      message:"First name must be at least 3 alphabets",
      data:null
    })
  }else if(!(lastName && lastName.length>3)){
       res.status(400).json({
      status:400,
      message:"Last name must be at least 3 alphabets",
      data:null
    }) 
  }else if(!(emailId && validator.isEmail(emailId))){
   res.status(400).json({
      status:400,
      message:"Email is not valid",
      data:null
    })
  } else if(!(password && password.length>=6)){
     res.status(400).json({
      status:400,
      message:"Password must be at  6 characters long",
      data:null
    })
  }

}

const encryptPasswordHandler=(password)=>{
   return bcrypt.hash(password, 10)

}

const validateProfileEdit = (profileData) => {
const allowedEditFIelds=["firstName","lastName","gender","age","photoUrl","about","skills"]
const isAllowd=Object.keys(profileData).every((key)=>allowedEditFIelds.includes(key))
return isAllowd;
}


module.exports ={ validateUserObject , encryptPasswordHandler,validateProfileEdit};