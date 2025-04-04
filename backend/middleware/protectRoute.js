import { ENV_VARS } from "../config/envVar.js";
import jwt from 'jsonwebtoken';
import {User} from "../models/usermodel.js"



const protectroute=async(req,res,next)=>{
try {
    const token=req.cookies.jwtnetflixCookie;
    if(!token){
        return res.status(401).json({success:false,message:"user unauthenticated!"})
    }

    const decoded=jwt.verify(token,ENV_VARS.JWTSECRET) //WE GET OUT THE DATA OF USER THAT has STORED IN THE token
    if(!decoded){
        return res.status(401).json({success:false,message:"user unauthenticated!"})
    }

    const currUser=await User.findById(decoded.userId).select("-password")
    if(!currUser){
        return res.status(401).json({success:false,message:"user not found!"})
    }
    req.user=currUser
    next()
} catch (error) {
    return res.status(500).json({success:false,message:"internal server issue!"})
}

}

export default protectroute