import { FetchfromTMDB } from "../services/tmdb.service.js";

export const getTrendingMovies = async (req, res) => {
    try {
        // Await the FetchfromTMDB function
        const data = await FetchfromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US');

        // Check if 'results' exist and contain movies
        if (!data || !data.results || data.results.length === 0) {
            return res.status(404).json({ success: false, message: "No trending movies found" });
        }

        // Select a random movie
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];

        // Send response
        res.json({ success: true, content: randomMovie });

    } catch (e) {
        console.error("Error fetching trending movies:", e.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const gettrailer=async(req,res)=>{
    const {id}=req.params;
    try {
        // Await the FetchfromTMDB function
        const data = await FetchfromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);

        // Send response
        res.json({ success: true, trailer: data.results });

    } catch (e) {
        console.error("Error fetching trending movies:", e.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

    
}
export const getmoviedetail=async(req,res)=>{
    const {id}=req.params;
    try {
        // Await the FetchfromTMDB function
        const data = await FetchfromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);

        // Send response
        res.json({ success: true, content: data});

    } catch (e) {
        console.error("Error fetching trending movies:", e.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

    

    
}
export const getsimilermovie=async(req,res)=>{
    const {id}=req.params;
    try {
        // Await the FetchfromTMDB function
        const data = await FetchfromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);

        // Send response
        res.json({ success: true, similer: data.results});

    } catch (e) {
        console.error("Error fetching trending movies:", e.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }


    
}
export const getmoviebycategory=async(req,res)=>{
    const {category}=req.params;
    console.log("hello")
    try {
        // Await the FetchfromTMDB function
        const data = await FetchfromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);

        // Send response
        res.json({ success: true, categorydata: data.results});

    } catch (e) {
        console.error("Error fetching trending movies:", e.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

    
}