import mongoose from "mongoose";
import { ENV_VARS } from "./envVar.js";

console.log(ENV_VARS)
export const connectDB=async()=>{
   try{
    const conn= await mongoose.connect(ENV_VARS.MONGO_URI);
    console.log(conn+"connects sucessfully");
   }catch(e){
    console.log(e);
    process.exit(1);
   }
}