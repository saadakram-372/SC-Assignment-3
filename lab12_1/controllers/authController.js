var express = require('express');
//var users = require('./user.json');
const appError = require('../utils/appError');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
// exports.GetTeamInfo  = function(req, res){

//     res.send(users);
// }



const signToken = (id) => {
  return jwt.sign({ id: id }, "my-32-character-ultra-secure-and-ultra-long-secret", {
    expiresIn: "90d",
  });
};


exports.signup = catchAsync(async(req, res,next) =>{
    
    const newuser = await User.create(req.body);
    //console.log("printing id",newuser._id)
    const token = signToken(newuser._id);
   // console.log("printing token",token)

    res.status(201).json({
        status: 'signup success',
        token,
        data: {
            newuser
        }
    });
});


exports.login = catchAsync(async(req, res,next) =>{
   const [{email,password}] = await req.body;
   if (!email || !password){
       // we  want to make sure that  it finishes right away
       const app = new appError("Please provide email and password", 400);
       app.showerror(req, res);
   }
   
   const user = await User.findOne({email}).select('+password');
  
    if (!user || !(await user.correctPassword(password,user.password))){
        const app =  new appError("Invalid email or password", 401);
        app.showerror(req, res);
   }
   else{
   // console.log("user id in login",user._id)
    const token =  signToken(user._id);
    
    res.status(200).json({ 
        status: 'success',
        token,
        message: 'login success'
    })
}
});


// create a middleware function here which should check for tokens, to see user are logined and then restrict or provide them access to certain routers
exports.protect = catchAsync(async (req, res, next) => {
    // add implementation of tokens here
    // console.log("in protect",req.body)

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

    }
   // console.log("i am token",token);
    if (!token) {
        const app = new appError("You are not logged in, login to get access to this route", 401)
        app.showerror(req, res)
    }
    // if (!token) {
    //     const app = new appError("You are not logged in, login to get access to this route", 401)
    //     app.showerror(req, res)
    // }
    const decoded = await promisify(jwt.verify)(token,"my-32-character-ultra-secure-and-ultra-long-secret")
    console.log(decoded)
    // console.log("in protect",req.body)
    next()
});

