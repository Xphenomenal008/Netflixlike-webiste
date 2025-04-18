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
      <div className='h-screen text-white relative'>
        <Navbar></Navbar>
         
         <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer'></div>


      </div>
    );
   
  return (
    <>
    <div className='relative h-screen text-white '>
      <Navbar></Navbar>
      {imgload&&
       <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer'></div>
      }
      <img onLoad={()=>setimageload(false)} src={ORG_IMG_URL + trending?.backdrop_path} className='absolute top-0 left-0 w-full h-full object-cover -z-50' alt="hero" />
      <div className='absolute top-0 left-0 w-full h-full bg-black/50 -z-50'></div>
      <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center px-0 md:px-16 lg:px-32'>
        <div className='bg-gradient-to-b from-black via-transparent to-transparent absolute w-full h-full top-0 left-0  -z-10'></div>
        <div className="main flex flex-col gap-2 p-4 lg:w-[850px]">
          <h1 className='flex flex-col '>
  <span className='text-6xl font-extrabold text-balance'>{trending?.title || trending?.name}</span>
          <span className='text-lg mt-2'>{trending?.release_date?.split("-")[0] ||
             trending?.first_air_date?.split("-")[0]}{' '} | {trending?.adult?"18+":"PG-13"}</span>
          </h1>
         
          <span className='text-lg text-wrap flex flex-wrap'>
            {trending?.overview.length>200?trending?.overview.slice(0,200) + "....":trending?.overview}
          </span>
          <div className='flex gap-2 mt-2'>
            <Link to={`/watch/${trending?.id}`}><button className='flex gap-1 bg-white/60 w-20 items-center justify-center text-black p-2 font-bold rounded-sm'><Play className='fill-black'></Play> Play</button></Link>
            <Link to={"/"}> <button className='flex gap-1 bg-slate-500/60 text-white p-2 font-bold rounded-sm'><Info></Info>More Info</button></Link>
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
