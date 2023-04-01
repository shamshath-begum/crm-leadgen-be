const mongoose=require('mongoose')
const validator=require('validator')
const LeadSchema=new mongoose.Schema({
    firstName:{type:String,required:true},
    middleName:{type:String},
    lastName:{type:String,required:true},
    email:{type:String,required:true ,
    validate:(value)=>validator.isEmail(value)
    },
    mobile:{type:String,required:true},
    course:{type:String,required:true},
    background:{type:String,required:true},
    profession:{type:String,required:true},
    preferredBatch:{type:String,required:true},
    status:{type:String,default:"Incoming"},
    initialQuote:{type:Number},
    finalQuote:{type:Number},
    createdBy:{type:String},
    createdAt:{type:Date,default:Date.now()}
},{versionKey:false,collection:"leads"})
const LeadModel=mongoose.model('leads',LeadSchema)
module.exports={LeadModel}