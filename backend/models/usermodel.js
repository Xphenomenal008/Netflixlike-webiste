import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    image:{
        type:String,
        default:''
    },
    searchHistory:{
       type:Array,
       default:[]
    }
})
export const User=mongoose.model("User",UserSchema)