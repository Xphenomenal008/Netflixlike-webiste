 import React, { useRef } from 'react'
 import { Link } from 'react-router-dom'
 const SignUPPage = () => {
  const usernameref=useRef()
  const emailref=useRef()
  const Passwordref=useRef()
  const submithandler=(e)=>{
    e.preventDefault()
  const username=usernameref.current.value
  const email=emailref.current.value
  const password=Passwordref.current.value
  console.log(username,email,password)
  }
    return (
        <div className='hero-bg h-screen w-screen'>
          <header className='max-w-6xl mx-auto flex items-center justify-center p-4'>
            <Link to="/">
            <img className='w-52' src="\netflix-logo.png" alt="logo" />
            </Link>
          </header>
          <div className="sign flex flex-col items-center justify-center bg-black/60 mt-32 py-4 h-96 w-96 mx-auto rounded-md ">
            <h1 className='text-white font-bold text-2xl'>Sign up</h1>
            <form onSubmit={submithandler} className='py-4 flex flex-col gap-3'>
                <div  className='flex flex-col text-white font-bold '>
                <label htmlFor="email">Email</label>
                <input ref={emailref} placeholder='JohnDoe@gamil.com' className='w-72  border-gray-600  focus:outline-none focus:ring bg-transparent  p-1 font-normal px-2 rounded-sm' name='email' type="email" />
                </div>
                <div className='flex flex-col text-white font-bold'>
                <label htmlFor="Username">Username</label>
                <input ref={usernameref} placeholder='John Doe' className='w-72 border-gray-700  focus:outline-none focus:ring bg-transparent px-2  font-normal rounded-sm' name='Username' type="name" />
                </div>
                <div className='flex flex-col text-white font-bold'>
                <label  htmlFor="Password">Password</label>
                <input ref={Passwordref} placeholder={"••••••"} className='w-72  border-gray-700 focus:outline-none focus:ring bg-transparent px-2  p-1 font-normal rounded-sm' name='Password' type="Password" />
                </div>
                  <button className=' bg-red-600 text-white p-1 w-72'>Sign up</button>
            </form>
             <div className='text-slate-50 font-bold'>Already a member?{" "} <Link to="/login"><span className='text-red-600'>Sign in</span></Link></div>
          </div>
        </div>
      )
 }
 
 export default SignUPPage
 