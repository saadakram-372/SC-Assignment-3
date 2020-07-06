const mongoose = require('mongoose')
const validator= require('validator')
const bcrypt = require('bcryptjs')
// photo stores the path to the actual image
const userSchema = new  mongoose.Schema({
 name : {
     type : String,
     required : [true,"Please  provide  name"]

    },
email : {
    type : String,
    required : [true,"Please provide email"],
    unique : true,
    lowercase:true,
    validate : [validator.isEmail]
},
photo : String,

role: { 
    type: String, 
    enum: ['admin', 'user']
}, 

password :{
    type : String,
    required : [true,"Please provide Password"],
    minLength: 8,
    select:false,

},
ConfirmPassword:{
    type : String,
    required : [true,"Please provide Password"],
    minLength: 8,
    validate : {
        validator:function(el){
            return el === this.password;
        },
    message:'Passwords do not match'
    }
},

changedPasswordAt:{
    type:String
}
});
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){return next();}
    this.password = await bcrypt.hash(this.password,12)
    this.ConfirmPassword = undefined;
    next();
})
userSchema.methods.correctPassword = async function(candiatePassword,userPassword){
    return bcrypt.compare(candiatePassword,userPassword)
    //userPassword is  hashed candiatePassword is password entered in login
}
const User = mongoose.model('User',userSchema);
module.exports = User;