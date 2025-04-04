import { User } from "../models/usermodel.js"
import { FetchfromTMDB } from "../services/tmdb.service.js"

export const searchperson=async(req,res)=>{
    const person=req.params.query
    console.log(person)
    try{
        const result=await FetchfromTMDB(`https://api.themoviedb.org/3/search/person?query=${person}&include_adult=false&language=en-US&page=1`)
        if(result.results.length===0){
            return res.status(404).send(null)
           }


           await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:{
                    id:result.results[0].id,
                    image:result.results[0].profile_path,
                    title:result.results[0].name,
                    searchtype:"person",
                    createdAt:new Date()
                }
            }
           })




        return res.status(200).json({success:true,content:result.results})
       
        

    }catch(e){
        return res.status(500).json({success:false,message:"internal server erro"})

    }

}

export const searchmovie=async(req,res)=>{

    const movie=req.params.query
    console.log(movie)
    try{
        const result=await FetchfromTMDB(`https://api.themoviedb.org/3/search/movie?query=${movie}&include_adult=false&language=en-US&page=1`)
        if(result.results.length===0){
            return res.status(404).send(null)
           }
            
           await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:{
                    id:result.results[0].id,
                    image:result.results[0].poster_path,
                    title:result.results[0].title,
                    searchtype:"movie",
                    createdAt:new Date()
                }
            }
           })




        return res.status(200).json({success:true,content:result.results})
       
        

    }catch(e){
        return res.status(500).json({success:false,message:"internal server erro"})

    }

}
export const searchtv=async(req,res)=>{
    const tv=req.params.query
    console.log(tv)
    try{
        const result=await FetchfromTMDB(`https://api.themoviedb.org/3/search/movie?query=${tv}&include_adult=false&language=en-US&page=1`)
        if(result.results.length===0){
            return res.status(404).send(null)
           }
            
           await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory:{
                    id:result.results[0].id,
                    image:result.results[0].poster_path,
                    title:result.results[0].name,
                    searchtype:"tvshow",
                    createdAt:new Date()
                }
            }
           })




        return res.status(200).json({success:true,content:result.results})
       
        

    }catch(e){
        return res.status(500).json({success:false,message:"internal server erro"})

    }

}

export const removeitemfromSearchHistory=async(req,res)=>{
    let {id}=req.params;
     id=Number(id)
    try{
        await User.findByIdAndUpdate(req.user._id,{
            $pull:{
                searchHistory:{id:id}
            }
        })
        return res.status(200).json({success:true,message:"Deleted sucessfully"})


    }catch(e){
        return res.status(500).json({success:false,message:e})

    }



}