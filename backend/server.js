import express from "express";
import Auth from "./routes/Auth_route.js" ;
import movieRoute from "./routes/movieRoute.js"
import searchRoute from './routes/Search_route.js'
import tvshow from "./routes/Tvshow_route.js"
import { ENV_VARS } from "./config/envVar.js";
import { connectDB } from "./config/Db.js";
import { User } from "./models/usermodel.js";//user collection we have!
import cookieParser from "cookie-parser";
import protectroute from "./middleware/protectRoute.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, '../frontend/dist');


const app=express();
const port=ENV_VARS.PORT;


app.use(express.json())//it let use parse incoming req.body data ...that is urlencodeed format to json fromat
app.use(cookieParser())


app.use("/api/v1/auth",Auth)
app.use("/api/v1/movies",protectroute,movieRoute)
app.use("/api/v1/tvshow",protectroute,tvshow)
app.use("/api/v1/search",protectroute,searchRoute)


if(ENV_VARS.NODEENV==="production"){
    app.use(express.static(frontendPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
}



app.listen(port,()=>{
    console.log("server is working!!")
    connectDB();
})