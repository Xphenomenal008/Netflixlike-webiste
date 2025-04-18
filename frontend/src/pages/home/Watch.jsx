import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useContent } from "../../store/content";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ReactPlayer from 'react-player';
import { ORG_IMG_URL } from "../../utils/constant";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { SMALL_IMG_URL } from "../../utils/constant";
import Watchskeleton from "../Watchskeleton";

const formrealesedata=(data)=>{
return new Date(data).toLocaleDateString("en-US",{
  year:"numeric",
  month:"long",
  day: "numeric"
});
}


const Watch = () => {
  const { id } = useParams();
  const [mymoviedetail, setmymoviedetail] = useState([]);
  const [loading, setloading] = useState(true);
  const [trailer, settrailer] = useState([]);
  const [similercontent, setsimilercontent] = useState([]);
  const [trailerIndex, settrailerIndex] = useState(0);
  const [showarrow, setshowarrow] = useState(false)
  
   


  //moviedeatil
  const { contentType } = useContent();
  const detail = contentType === "movies" ? "moviedetail" : "tvdetail";
  useEffect(() => {
    setloading(true);
    const getmovie = async () => {
      const res = await axios.get(`/api/v1/${contentType}/${id}/${detail}`);
      setmymoviedetail(res.data.content);
      setloading(false);
    };
    getmovie();
  }, [id, contentType]);

  //movietrailer
  useEffect(() => {
    const getmovie = async () => {
      setloading(true);
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        settrailer(res.data.trailer);
        setloading(false);
      } catch (e) {
        if (e.message.includes(404)) {
          settrailer([]);
        }
      }
    };
    getmovie();
  }, [id, contentType]);

  //similermovies
  useEffect(() => {
    const getmovie = async () => {
      setloading(true);
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/similer`);
        setsimilercontent(res.data.similer);
        setloading(false);
      } catch (e) {
        if (e.message.includes(404)) {
          setsimilercontent([]);
        }
      }
    };
    getmovie();
  }, [id, contentType]);

  const goToNextTrailer = () => {
    // Only go to next if not already at the last trailer
    if (trailerIndex < trailer.length - 1) {
      settrailerIndex(trailerIndex + 1);
    }
  };

  const goToPreviousTrailer = () => {
    // Only go to previous if not already at the first trailer
    if (trailerIndex > 0) {
      settrailerIndex(trailerIndex - 1);
    }
  };
  const sliderref=useRef()
  const rightslide=()=>{
    sliderref.current.scrollBy({left:sliderref.current.offsetWidth,behavior:'smooth'})
   
     }
     const leftslide=()=>{
    sliderref.current.scrollBy({left:-sliderref.current.offsetWidth,behavior:'smooth'})
     }

     if(loading){
      return(
      <div className="min-h-screen bg-black p-10">
       <Watchskeleton></Watchskeleton>
      </div>
      )
     }
     if(!similercontent || !trailer || !mymoviedetail){
      setloading(false)
      return(
        <div className="min-h-screen bg-black p-10">
          <div className="max-w-6xl mx-auto">
            <Navbar></Navbar>
             <div className="text-center mx-auto h-full">
              <h2 className="text-2xl text-center">Sorry content not found!</h2>

             </div>
          </div>
        </div>
        )
     }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="mx-auto container px-4  h-full">
        <Navbar />
        {trailer.length > 0 && (
          <div className="flex justify-around mt-16  lg:mt-0 lg:justify-between item-center mb-4">
            <button
              onClick={goToPreviousTrailer}
              disabled={trailerIndex === 0}
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                trailerIndex === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={goToNextTrailer}
              disabled={trailerIndex === trailer.length - 1}
              className={`bg-gray-500/70 hover:bg-gray-500 text-white py-2 px-4 rounded ${
                trailerIndex === trailer.length - 1
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        <div className="aspect-video mb-8 p-2 sm:px-10 md:px-32">
        {
          trailer.length>0 && (
            <ReactPlayer
            controls={true}
            width={"100%"}
            height={"70vh"}
            className='mx-auto overflow-hidden rounded-lg'
            url={`https://www.youtube.com/watch?v=${trailer[trailerIndex].key}`}
            />
          )
        }
        { trailer?.length ===0 && (
                <h2 className="text-xl text-center mt-5 ">
                  No trailers available for {" "}
                  <span className="font-bold text-red-500">{mymoviedetail?.title || mymoviedetail?.name}</span>
                </h2>
             
        )
        }
        </div>
        <div className="flex flex-col md:flex-row justify-center item-center gap-20 max-w-6xl mx-auto">
          <div className="flex justify-center items-center gap-16 mx-auto  mb-4 md:mb-0">
            <div className="flex-1">
            <h2 className="text-5xl font-bold text-balance">
              {mymoviedetail?.title || mymoviedetail?.name }
            </h2>

            <p className="mt-2 text-lg ">
              {formrealesedata(mymoviedetail?.release_date||mymoviedetail?.first_air_date)} | {" "}
              {mymoviedetail?.adult?(
                <span className="text-red-600">18+</span>
              ):(<span className="text-green-600">PG-13</span>)}{" "}
              
            </p>
            <p className="mt-4 text-lg justify-stretch">{mymoviedetail.overview}</p>
            </div>

            <div className="flex-1">
        <img src={ORG_IMG_URL + mymoviedetail.poster_path} alt="poster_img" className="max-h-[600px] w-full rounded-md" />
        </div>
          </div>
        
        </div>

 {/* smiler section */}
 <div className='text-white bg-black relative px-16 mt-3 py-3  '>
      <h2 className='mb-4 text-xl font-extrabold'>Similer {contentType=="movies"?"Movies":"Tv Shows"}</h2>
      <div
        className='relative'
        onMouseEnter={() => setshowarrow(true)}
        onMouseLeave={() => setshowarrow(false)}
      >
        <div className='flex space-x-3 overflow-x-scroll  scrollbar-hide '  ref={sliderref}>
          {
            similercontent.map((item) => {
              if (item.poster_path === null) return null;
              return (
                <Link className='min-w-[260px]  relative group' key={item.id} to={`/watch/${item.id}`}>
                  <div className='overflow-hidden rounded-lg'>
                    <img className='transition-transform duration-300 ease-in-out group-hover:scale-125 h-[360px] object-cover' src={SMALL_IMG_URL + item.backdrop_path} alt="movie" />
                  </div>
                  <span className='flex justify-center items-center '>{item.original_title || item.name}</span>
                </Link>
              );
            })
          }
        </div>

        {
          showarrow && (
            <>
              <button onClick={leftslide} className='absolute top-1/2 -translate-y-1/2 left-2 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10'>
                <ChevronLeft size={24} />
              </button>

              <button onClick={rightslide} className='absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center size-12 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 text-white z-10'>
                <ChevronRight size={24} />
              </button>
            </>
          )
        }
      </div>
    </div>



      </div>
    </div>
  );
};

export default Watch;
