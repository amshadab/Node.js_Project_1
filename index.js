const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const mongoose = require("mongoose");
const { type } = require("os");


const app = express();
const PORT = 8000;

// Connection
mongoose.connect("mongodb://127.0.0.1:27017/app-1")
.then(()=>{
  console.log("MongoDB Connected");
})
.catch((err)=>{
  console.log(err);
});
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

//
app.use(express.urlencoded({ extended: false }));

app.use((req,res,next)=>{
  fs.appendFile("log.txt",`${Date.now()}: ${req.method}: ${req.path}\n`,(err)=>{
    if(err){
      console.log(err);
    }
  });
  next()
});

// html rendering
app.get("/users", async(req, res) => {
  const result = await User.find({});
  const html = `
    <ul>
    ${result.map((user) => `<li>${user.firstName}</li>`).join("")}
    </ul>
    `;
  return res.send(html);
});

// return json
app.get("/api/users",async (req, res) => {
  // console.log(req.headers);
  
  // Custom headers
  // res.set({
  //   "X-Myname":"Shadab",
  //   "X-Path":req.path
  
  // });
 const result = await User.find({});
  return res.json(result);
});

app
  .route("/api/users/:id")
  .get(async(req, res) => {
    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(404).json({user : "not found"});
    }
    return res.json(user);
  })
  .patch(async(req, res) => {
    const body = req.body;
   const user = await User.findByIdAndUpdate(req.params.id,{firstName:body.first_name});
    
    // u=users.map(user=>{
    //   if(user.id===id){
    //     return {...user,...body}
    //   }
    //   else{
    //     return user;
    //   }
  
    // });

    // fs.writeFile("./MOCK_DATA.json",JSON.stringify(u),(err)=>{
    //   if(err){
    //     console.log(err);
        
    //   }
    // });

    return res.json({ status: "Success",id:"Updated" });
  })
  .delete(async(req, res) => {
    // const id = Number(req.params.id);
    // const updatedUsers=users.filter(user=>user.id!==id);
    // fs.writeFile("./MOCK_DATA.json",JSON.stringify(updatedUsers),(err)=>{
    //   if(err){
    //     console.log(err);
    //   }
    // });

    await User.findByIdAndDelete(req.params.id);
    return res.json({ status: "Success", id:"Deleted" });
  });

app.post("/api/users", async(req, res) => {
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



  return res.status(201).json({Message:"Success"});
});

app.listen(PORT, () => {
  console.log(`Server Started as PORT: ${PORT}`);
});
