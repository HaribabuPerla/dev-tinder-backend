const bcrypt = require("bcrypt");
const validator = require("validator");

const validateUserObject =  (userObj) => {
  const{firstName, lastName, emailId, password}=userObj;
  if(!(firstName && firstName.length >= 4)){
    throw new Error("First name must be at least 3 alphabets");
  }else if(!(lastName && lastName.length>=4)){
    throw new Error("Last name must be at least 3 alphabets");  
  }else if(!(emailId && validator.isEmail(emailId))){
    throw new Error("Email is not valid");
  } else if(!(password && password.length>=6)){
    throw new Error("Password must be at least 6 characters long");
  }

}

const encryptPasswordHandler=(password)=>{
   return bcrypt.hash(password, 10)

}
module.exports ={ validateUserObject , encryptPasswordHandler};