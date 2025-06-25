const User = require("../models/user")

async function handleGetAllUser(req,res){
     const result = await User.find({});
    return res.json(result);
}


async function handleGetUserById(req,res) {
     const user = await User.findById(req.params.id);

    if(!user){
      return res.status(404).json({user : "not found"});
    }
    return res.json(user);
}

async function handleUpdateUserById(req,res) {
     const body = req.body;
   const user = await User.findByIdAndUpdate(req.params.id,{firstName:body.first_name});
    return res.json({ status: "Success",id:"Updated" });
}

async function handleDeleteUserById(req,res) {

    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success", id:"Deleted" });
}

async function handleAddUser(req,res) {
    const body = req.body;

  if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
    return res.status(400).json({msg: "All fields are required..."});
  }

 const result = await User.create({
  firstName:body.first_name,
  lastName:body.last_name,
  email:body.email,
  jobTitle:body.job_title,
  gender:body.gender,

 });



  return res.status(201).json({Message:"Success",id:result._id});
}

module.exports ={
    handleGetAllUser,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleAddUser,
}