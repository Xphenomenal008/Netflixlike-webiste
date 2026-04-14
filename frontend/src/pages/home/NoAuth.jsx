import React, { useState } from 'react'
import { useAuthstore } from '../../store/zustand'
import { Play } from 'lucide-react'
import { Info } from 'lucide-react'
import { Link } from 'react-router-dom'

import Navbar from '../components/Navbar'
import usegetTrending from '../../customhook/usegetTrending'
import { MOVIE_CATEGORY, ORG_IMG_URL , SMALL_IMG_URL, TV_CATEGORY } from '../../utils/constant'
import Showlist from '../Showlist'
import { useContent } from '../../store/content'


const NoAuth = () => {
   const {trending}=usegetTrending()
   const {contentType}=useContent()
   const [imgload,setimageload]=useState(true)
   console.log("my trending"+ trending)

   if(!trending)
    return(
      <div className='h-screen text-white relative overflow-hidden'>
        <Navbar></Navbar>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 via-black to-black flex items-center justify-center'>
          <div className='text-center'>
            <div className='inline-block animate-spin'>
              <div className='w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full'></div>
            </div>
            <p className='text-gray-400 text-lg mt-4'>Loading your content...</p>
          </div>
        </div>
      </div>
    );
   
  return (
    <>
    <div className='relative h-screen text-white overflow-hidden'>
      <Navbar></Navbar>
      
      {/* Background Image with Fallback */}
      <div className='absolute top-0 left-0 w-full h-full'>
        {trending?.backdrop_path ? (
          <>
            {imgload && (
              <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900 to-black -z-50'></div>
            )}
            <img 
              onLoad={()=>setimageload(false)} 
              src={ORG_IMG_URL + trending.backdrop_path} 
              className='w-full h-full object-cover -z-50' 
              alt="hero"
              onError={()=>{
                console.log('Image failed to load');
                setimageload(false);
              }}
            />
          </>
        ) : (
          <div className='w-full h-full bg-gradient-to-br from-slate-900 via-black to-black -z-50'></div>
        )}
        <div className='absolute top-0 left-0 w-full h-full bg-black/50 -z-40'></div>
      </div>

      {/* Content Overlay */}
      <div className='relative z-10 h-full flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-32 py-20 max-w-3xl'>
          <h1 className='flex flex-col gap-2'>
            <span className='text-5xl sm:text-6xl lg:text-7xl font-extrabold text-balance leading-tight'>{trending?.title || trending?.name || "Featured Content"}</span>
            <span className='text-base sm:text-lg text-gray-300'>{trending?.release_date?.split("-")[0] || trending?.first_air_date?.split("-")[0] || "N/A"} | {trending?.adult?"18+":"PG-13"}</span>
          </h1>
         
          <p className='text-sm sm:text-base lg:text-lg text-gray-200 leading-relaxed mt-6 max-w-2xl'>
            {trending?.overview ? (trending?.overview.length>220 ? trending?.overview.slice(0,220) + "..." : trending?.overview) : "Experience premium entertainment with our curated selection."}
          </p>
          <div className='flex gap-3 mt-6'>
            <Link to={`/watch/${trending?.id}`}><button className='flex gap-2 bg-white hover:bg-gray-200 text-black px-5 sm:px-8 py-2 sm:py-3 font-bold rounded transition items-center text-sm sm:text-base'><Play size={20} className='fill-black'></Play> Play</button></Link>
            <Link to={"/"}> <button className='flex gap-2 bg-gray-600 hover:bg-gray-700 text-white px-5 sm:px-8 py-2 sm:py-3 font-bold rounded transition items-center text-sm sm:text-base'><Info size={20}></Info> More Info</button></Link>
          </div>
        </div>
      </div>
    </div>

    <div className="two flex flex-col gap-10 bg-black py-10 text-white">
{
  contentType === "movies"?MOVIE_CATEGORY.map((item,ind)=><Showlist  key={ind} item={item}></Showlist>):
  TV_CATEGORY.map((item,ind)=><Showlist key={ind} item={item}></Showlist>)
}

    </div>
    
    </>
  )
}

export default NoAuth
