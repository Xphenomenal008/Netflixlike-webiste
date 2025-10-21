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
        return res.status(500).json({success:false,message:"internal server error"})

    }

}

 

export const addToSearchHistory = async (req, res) => {
  try {
    const { userId, id, title, searchtype, image } = req.body; // include id
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ Prevent duplicates (by TMDB id + type)
    const exists = user.searchHistory.find(
      (item) => item.id === id && item.searchtype === searchtype
    );

    if (!exists) {
      user.searchHistory.push({ id, title, searchtype, image, createdAt: new Date() });

      // Optional: keep last 20 searches
      if (user.searchHistory.length > 20) {
        user.searchHistory.shift(); // remove oldest
      }

      await user.save();
    }

    res.json({ message: "Added to search history" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to add history" });
  }
};


export const getSearchHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("searchHistory");
    res.json({ history: user.searchHistory || [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const removeitemfromSearchHistory = async (req, res) => {
  try {
    const { id } = req.params; // TMDB id
    const userId = req.user._id;

    // ✅ Delete by TMDB id (number)
    await User.findByIdAndUpdate(userId, {
      $pull: { searchHistory: { id: Number(id) } },
    });

    res.json({ success: true, message: "Item removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove item" });
  }
};




