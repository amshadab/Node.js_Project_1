const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");


const app = express();
const PORT = 8000;

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
app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
  return res.send(html);
});

// return json
app.get("/api/users", (req, res) => {
  console.log(req.headers);
  
  res.set({
    "X-Myname":"Shadab",
    "X-Path":req.path
  
  });
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);

    if(!user){
      return res.status(404).json({user : "not found"});
    }
    return res.json(user);
  })
  .patch((req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    u=users.map(user=>{
      if(user.id===id){
        return {...user,...body}
      }
      else{
        return user;
      }
  
    });

    fs.writeFile("./MOCK_DATA.json",JSON.stringify(u),(err)=>{
      if(err){
        console.log(err);
        
      }
    });

    return res.json({ status: "Success",id:"Updated" });
  })
  .delete((req, res) => {
    const id = Number(req.params.id);
    const updatedUsers=users.filter(user=>user.id!==id);
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(updatedUsers),(err)=>{
      if(err){
        console.log(err);
      }
    });
    return res.json({ status: "Success", id:"Deleted" });
  });

app.post("/api/users", (req, res) => {
  const body = req.body;

  if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
    return res.status(400).json({msg: "All fields are required..."});
  }
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.log(err);
    }
  });

  return res.status(201).json({status: "success", id: users.length});
});

app.listen(PORT, () => {
  console.log(`Server Started as PORT: ${PORT}`);
});
