 import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
 export const useAuthstore=create((set)=>({
    user:null,
    islogin:false,
    islogout:false,
    ischeckingauth:true,
    issignup:false,//for loading purpose only
    Oursignup:async(credinals)=>{//we take credinals from the form here .that filled by the user
        set({issignup:true})//this we only using  from loading purpose only
        try{
          
            const response= await axios.post('/api/v1/auth/signup',credinals);
            set({user:response.data.user,issignup:false})
            toast.success("signup successfully")
        }catch(e){
          
        }
    },
    login:async(credinals)=>{
      set({islogin:true})
      try{
          const res= await axios.post("/api/v1/auth/login",credinals)
          set({user:res.data.user,islogin:false})
          toast.success(`Logged in successfully we welcome you ${res.data.user.username} `)
      }catch(e){
        console.log("Error:", e); // Log the error
          toast.error(e.response?.data?.message || "An error has occurred!");
          set({islogin:false,user:null})

      }

    },
    logout:async()=>{
      set({islogout:true})
      try{
          await axios.post('/api/v1/auth/logout')
          set({user:null,islogout:false})
          toast.success(" Logout  successfully")
          

      }catch(e){
         set({islogout:false})
        console.log("Error:", e); // Log the error
          toast.error(e.response?.data?.message || "An error has occurred!");
      }
    },
    authcheck:async()=>{
      set({ischeckingauth:true})
      try{
        await axios.get('/api/v1/auth/authcheck', {
          withCredentials: true
        });
        
          set({user:response.data.user,ischeckingauth:false})
      }catch(e){
           set({ischeckingauth:false,user:null})
      }   

    }

 }))