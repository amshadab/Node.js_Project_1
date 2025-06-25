const mongoose = require("mongoose");

// Schema
const userSchema= new mongoose.Schema({
  firstName: {
    type:String,
    required: true,
  },
  lastName:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  jobTile:{
    type:String,
  },
  gender:{
    type:String,
  },
},{timestamps:true});

// model
const User=mongoose.model("users", userSchema);

module.exports = User;