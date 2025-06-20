const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");


const app = express();
const PORT = 8000;

//
app.use(express.urlencoded({ extended: false }));

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
  return res.json(users);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
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
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.log(err);
    }
  });

  return res.json({status: "success", id: users.length});
});

app.listen(PORT, () => {
  console.log(`Server Started as PORT: ${PORT}`);
});
