import express from "express";
import { User } from "../models/usermodel.js";
import bcryptjs from "bcryptjs";
import bcrypt from "bcryptjs";
import { genrateTokenAndSetCokkie } from "../utilities/genrateToken.js";

export const signup=async(req,res)=>{
    const {email,password,username}=req.body
    console.log(email,password,username)
     try{
        if(!email || !password || !username){
            return res.status(400).json({sucess:false,message:"All fields are required!"})
        }
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({sucess:false,meassage:"invalid email!"})
        }
        if(password.length<6){
            return res.status(400).json({sucess:false,meassage:"password must be atleast of 6 characters!"})
        }

        const existingUser=await User.findOne({email:email})
        if(existingUser){
            return res.status(400).json({sucess:false,meassage:"user already exists by this email!"})
        }
        const Profile_pics=["/avatar1.png","/avatar2.png","/avatar3.png"]
        const image=Profile_pics[Math.floor(Math.random()*Profile_pics.length)];
        const salt=await bcryptjs.genSalt(10);
        const hashpassword=await bcrypt.hash(password,salt)
        const newUser=new User({
            email,
            password:hashpassword,
            username,
            image:image
        })
        genrateTokenAndSetCokkie(newUser._id,res)
       await newUser.save()

       return res.status(200).json({success:true,user:{
        ...newUser._doc,
        password:""
       }})

     }catch(e){
        console.log(e)
        return res.status(500).json({success:false,meassage:"internal server error!"})
     }
   }

export const login=async(req,res)=>{
     const {email,password}=req.body
     console.log(email,password)
     try {
        if(!email || !password ){
            return res.status(400).json({success:false,message:"All fields are required!"})
        }
        const existinguser=await User.findOne({email})
        if(!existinguser){
            return res.status(400).json({success:false,message:"you donot have an account please signup!"})
        }

        const pass=await bcryptjs.compare(password,existinguser.password)
        if(!pass){
            return res.status(400).json({success:false,message:"password is incorrect!"})
        }
        genrateTokenAndSetCokkie(existinguser._id,res)
        return res.status(200).json({success:true,user:{
            ...existinguser._doc,
            password:""
           }})
    

        
     }catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"internal server error!"})
     }

   }

export const logout=async(req,res)=>{
    try {
        res.clearCookie("jwtnetflixCookie")
        return res.status(201).json({success:true,message:"logout sucessfully!"})
    } catch (error) {
        return res.status(500).json({success:false,message:"internal server error!"})
        
    }
   }