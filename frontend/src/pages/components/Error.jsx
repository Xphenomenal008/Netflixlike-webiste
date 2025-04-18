import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {
    const navigate=useNavigate()
    const handleclick=()=>{
navigate("/")
    }
  return (
<div className="relative">
  <img className='h-screen w-screen object-cover' src="/404.png" alt="404 Not Found" />
  
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

  <div className='absolute z-20 top-96 px-6 md:px-96 lg:left-64 text-white flex flex-col justify-center items-center text-center'>
    <h1 className='text-4xl font-mono md:text-7xl'>Lost Your Way!</h1>
    <p className='md:text-2xl'>Sorry, we can't find that page. You'll find lots to explore on the home page.</p>
    <button 
      onClick={handleclick} 
      className='bg-slate-700 text-white font-bold p-3 rounded-sm mt-3'
    >
      Way to Home!
    </button>
  </div>
</div>

  )
}

export default Error
