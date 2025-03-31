import express from "express";
import Auth from "./routes/Auth_route.js" ;
import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/Db.js";
import { User } from "./models/usermodel.js";//user collection we have!

const app=express();
const port=ENV_VARS.PORT;
app.use(express.json())//it let use parse incoming req.body data ...that is urlencodeed to json fromat
app.use("/api/v1/auth",Auth)


app.listen(port,()=>{
    console.log("server is working!!")
    connectDB();
})