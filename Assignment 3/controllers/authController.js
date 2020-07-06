var express = require('express');
const appError = require('../utils/appError');
var sendMail = require('../sendMail');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');


 exports.deleteUser = catchAsync(async(req,  res, next) =>{
 
 //getting ID of User to be deleted
 const userId = req.params.id;
 const token = req.headers.authorization.split(" ")[1];
 const user=  await promisify(jwt.verify)(token,"my-32-character-ultra-secure-and-ultra-long-secret");


//Checking if user sending delete request is Admin
if (user['role'] != 'admin'){
  const app = new appError('Only Admin can delete users', 400);
  app.showerror(req, res);}
  
 
//Finding user having the ID given 
else if  ( !await User.findByIdAndDelete(userId)) { 
  const app = new appError(`Invalid ID:Can not find user with ID: ${userId}`, 400);
  app.showerror(req, res);}


//User deleted successfully 
else {
  res.status(200).json({
  message: `User with ID: ${userId} has been deleted` });
}
});
 


const signToken = (id, role, resetToken) => {
  let expireTime;

  //Checking if token to be signed is reset token.If yes,then setting its expiration time to 15 mins (0.25 h)
  if (resetToken==true){ 
    expireTime="0.25h";
  } 
  else {
    expireTime="90d";
  }
  
  //Signing token
  return jwt.sign({ id: id, role: role}, "my-32-character-ultra-secure-and-ultra-long-secret", {
    expiresIn: expireTime,
  });
};


exports.signup = function (role) {
 return catchAsync(async(req,  res, next) =>{
  //Creating User and signing the token
   req.body.role=role; //role is the value being passed to function i.e user or admin
   const newuser = await User.create(req.body);
   const token = signToken(newuser._id);

   res.status(201).json({
        status: 'signup success',
        token,
        data: {
            newuser
        }})});
      
}

exports.login = function (role) {

return catchAsync(async(req,  res, next) =>{
  
//Getting email and password
 const email = req.body.email;
 const password=req.body.password;
 
   if (!email || !password){
       // we  want to make sure that  it finishes right away
       const app = new appError("Please provide email and password", 400);
       app.showerror(req, res);
   }

  //Getting user by email
  const user = await User.findOne({email}).select('+password');

  //If user can't be found
  if (!user || !(await user.correctPassword(password,user.password))){
        const app =  new appError("Invalid email or password", 401);
        app.showerror(req, res);
   }

   //checking if user is logging in from right portal according to his role
   else if ( user.role != role){
     const app = new appError("Make sure you are logging in from the right portal.", 400);
       app.showerror(req, res);
   }

   else{
   const token =  signToken(user._id, user.role,false);
    res.status(200).json({ 
        status: 'success',
        token,
        message: 'login success' })
    }
 });
}


//Middleware function to see if user is logged in and restrict or provide them access to certain routers
exports.protect = catchAsync(async (req, res, next) => {
   
//Extracting token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
  }

//If no token is provided, it means user is not logged in
  if (!token) {
        const app = new appError("You are not logged in, login to get access to this route", 401)
        app.showerror(req, res)
    }

//Decoding the token
  let decoded;
  decoded = await promisify(jwt.verify)(token,"my-32-character-ultra-secure-and-ultra-long-secret") 
  next()   
});


exports.forgotPassword =  catchAsync(async(req, res, next) => {
  //Getting user based on posted email
  const email = req.body.email;
  
  if (!email){ 
       const app = new appError("Please provide Email", 400);
       app.showerror(req, res);
   }



  //Getting user
  const user = await User.findOne({email});
  console.log(user)
  //If user doesn't exist then throw error
  if (!user){
     const app =  new appError("Email not found in database", 401);
     app.showerror(req, res);
}

//Generating the random reset token
const new_token = signToken(user._id,'user', true);

//Sending it to user’s email
 try { sendMail.sendEmail(new_token,user.email);
 res.status(200).json({ 
    status: 'success',
   
    message: 'Reset Token Generated.Email sent' })}
 catch (err) { return next(new AppError('There was an error sending email'), 500);}

//(for now sending the new token as response)


});


exports.resetPassword = catchAsync(async(req, res, next) => {
//Getting user based on the token
const resetToken=req.params.token;
let password=req.body.password;
let ConfirmPassword=req.body.ConfirmPassword;

 if (!ConfirmPassword || !password){
       const app = new appError("Please provide password and confirm password", 400);
       app.showerror(req, res);
   }

//check if both passwords given are same
if (password != ConfirmPassword) {   
  const app =  new appError("Passwords do not match", 401);
  app.showerror(req, res);
}
 password = await bcrypt.hash(password,12);
 ConfirmPassword = undefined;
 
 const decodedToken = await promisify(jwt.verify)(resetToken,"my-32-character-ultra-secure-and-ultra-long-secret")
 const id=decodedToken['id']

//If token has not expired, and there is user, set the new password
const user =await User.findByIdAndUpdate(id, {"password":password, "ConfirmPassword": ConfirmPassword}, {  runValidators: false});

if (!user) {
       const app = new AppError(`Can not find User with id ${req.params.id} on our database`, 404);
       app.showerror(req, res);}
          
//Updating changedPasswordAt property for the user
const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date+' '+time;

user.changedPasswordAt=dateTime;

//Sending JWT
const token = signToken(user._id, user.role,false);

res.status(200).json({
status: `Password changed successfully at ${dateTime} `,
token,});
});

