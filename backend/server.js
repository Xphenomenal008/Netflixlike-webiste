import express from "express";
import Auth from "./routes/Auth_route.js" ;
import movieRoute from "./routes/movieRoute.js"
import tvshow from "./routes/Tvshow_route.js"
import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/Db.js";
import { User } from "./models/usermodel.js";//user collection we have!

const app=express();
const port=ENV_VARS.PORT;
app.use(express.json())//it let use parse incoming req.body data ...that is urlencodeed format to json fromat
app.use("/api/v1/auth",Auth)
app.use("/api/v1/movies",movieRoute)
app.use("/api/v1/tvshow",tvshow)


app.listen(port,()=>{
    console.log("server is working!!")
    connectDB();
})