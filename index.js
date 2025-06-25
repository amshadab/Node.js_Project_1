const express = require("express");
const {connectMongoDb} = require("./connection")
const userRouter = require("./routes/user");
const {logReqRes} = require("./middlewares/")

const app = express();
const PORT = 8000;

// Connection
connectMongoDb("mongodb://127.0.0.1:27017/app-1").then(()=>{
  console.log("MongoDB connected");
  
});

//
app.use(express.urlencoded({ extended: false }));
app.use(logReqRes("log.txt"));
app.use("/api/user",userRouter)

// routes

app.listen(PORT, () => {
  console.log(`Server Started as PORT: ${PORT}`);
});
