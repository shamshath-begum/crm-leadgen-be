const mongoose=require('mongoose')
const validator=require('validator')
const UserSchema=new mongoose.Schema({
    firstName:{type:String,required:true},
    middleName:{type:String},
    lastName:{type:String,required:true},
    email:{type:String,required:true ,
    validate:(value)=>validator.isEmail(value)
    },
role:{type:String,default:"salesRep"},
    password:{type:String,required:true},
    status:{type:String,default:"Y"},
    token:{type:String},
    // verifytoken:{type:String,default:null},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false})


const UserModel=mongoose.model('user',UserSchema)
module.exports={UserModel}