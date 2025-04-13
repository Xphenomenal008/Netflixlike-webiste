import React, { useEffect, useRef, useState } from 'react'
import { useContent } from '../store/content'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { SMALL_IMG_URL } from '../utils/constant'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Showlist = ({ item }) => {
  const sliderref=useRef()
  const [data, setdata] = useState([])
  const { contentType } = useContent()
  const [showarrow, setshowarrow] = useState(false)

  const formattedcontentType = contentType === "movies" ? "movies" : "TV Shows"
  const formattedcategoryName = item.replaceAll("-", " ")[0].toUpperCase() + item.replaceAll("-", " ").slice(1)

  useEffect(() => {
    const getcontent = async () => {
      const res = await axios.get(`/api/v1/${contentType}/${item}`)
      setdata(res.data.content)
    }
    getcontent()
  }, [contentType, item])

  const rightslide=()=>{
 sliderref.current.scrollBy({left:sliderref.current.offsetWidth,behavior:'smooth'})
  }
  const leftslide=()=>{
 sliderref.current.scrollBy({left:-sliderref.current.offsetWidth,behavior:'smooth'})
  }

  return (
    <div className='text-white bg-black relative px-5'>
      <h2 className='mb-4 text-lg'>{formattedcategoryName} {formattedcontentType}</h2>
      <div
        className='relative'
        onMouseEnter={() => setshowarrow(true)}
        onMouseLeave={() => setshowarrow(false)}
      >
        <div className='flex space-x-3 overflow-x-scroll  scrollbar-hide '  ref={sliderref}>
          {
            data.map((item) => (
              <Link className='min-w-[360px] relative group' key={item.id} to={`/watch/${item.id}`}>
                <div className='overflow-hidden rounded-lg'>
                  <img className='transition-transform duration-300 ease-in-out group-hover:scale-125' src={SMALL_IMG_URL + item.backdrop_path} alt="movie" />
                </div>
                <span className='flex justify-center items-center'>{item.original_title || item.name}</span>
              </Link>
            ))
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
  )
}

export default Showlist
