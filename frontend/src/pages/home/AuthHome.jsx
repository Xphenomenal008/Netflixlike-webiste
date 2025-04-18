import React, { useRef } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const AuthHome = () => {
  const youremail=useRef()
  const navigate=useNavigate()

  const starthandler=(e)=>{
  e.preventDefault()
  navigate("/signup?email=" + youremail.current.value)
  }
  return (
    <>
      <div className="hero-bg  relative">
        {/* navbar*/}
        <header className="nav  flex max-w-6xl mx-auto justify-between items-center px-3 md:h-28 mt-0 py-0 ">
          <div className="img ">
            <img className="w-72 " src="/logo-transparent.png" alt="logo" />
          </div>

          <div className="btn text-white p-3 h-12 rounded-sm bg-[rgba(196,31,50,0.91)]">
            <Link to={"/login"}>
              <button>Sign in</button>
            </Link>
          </div>
        </header>
        {/* hero section*/}
        <div className="text-white flex flex-col justify-center text-center items-center mx-auto gap-3 py-44 max-w-6xl">
          <div className="one font-bold text-3xl md:text-6xl">
            Unlimited movies, Tv shows, and more
          </div>
          <div className="two md:text-lg">Watch anywhere Cancel anytime</div>
          <div className="text-wrap ">
            Ready to watch? Enter your email to create or restart your
            membership.
          </div>
          {/*email div*/}
          <div className="flex justify-center items-center align-middle gap-2 ">
            <div className="email">
              <input
                className="md:w-96 w-40  p-3 rounded-sm border-gray-600  focus:outline-none focus:ring bg-black "
                placeholder="Enter your email"
                type="text"
                ref={youremail}
              />
            </div>
            <button onClick={starthandler} className="bg-[rgba(196,31,50,0.91)] md:text-lg rounded-sm text-white p-2 w-28 md:w-40">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* seprator*/}
      <div className="h-2 w-full bg-[#232323] " aria-hidden="true"></div>
      {/*second section*/}
      <div className="py-10 bg-black text-white">
        <div className="flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col px-4 md:px-2">
          {/*Left side */}
          <div className="flex-1">
            <div className="relative">
              <img
                src="/stranger-things-lg.png"
                alt="stranger things img"
                className="mt-4"
              />
              <div
                className="flex items-center gap-2 absolute bottom-5 left-1/2 -translate-x-1/2 bg-black
                      w-3/4 lg:w-1/2 h-24 border border-slate-500 rounded-md px-2
                      "
              >
                <img
                  src="/stranger-things-sm.png"
                  alt="image"
                  className="h-full"
                />
                <div className="flex justify-around items-center w-full">
                  <div className="flex flex-col gap-0">
                    <span className="text-md lg:text-lg font-bold">
                      Stranger Things
                    </span>
                    <span className="text-sm text-blue-500">
                      Downloading...
                    </span>
                  </div>
                  <img className="h-12" src="/download-icon.gif" alt="" />
                </div>
              </div>
            </div>
          </div>
          {/* right section*/}
          <div className="flex-1 md:text-left text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">
              Download your shows to watch offline
            </h2>
            <p className="text-lg md:text-xl">
              save your favorites easily and alwayes have something to watch.
            </p>
          </div>
        </div>
      </div>

      <div className="h-2 w-full bg-[#232323] " aria-hidden="true"></div>

      {/*Third section*/}
      <div className="py-10 bg-black text-white">
        <div className="flex max-w-6xl mx-auto items-center justify-center md:flex-row-reverse flex-col-reverse px-4 md:px-2">
          {/*Left side */}
          <div className="flex-1 relative overflow-hidden">
            <img
              src="/device-pile.png"
              alt="device image"
              className="mt-4 z-20 relative"
            />
            <video
              className="absolute top-2 left-1/2 -translate-x-1/2 h-4/6 z-10 max-w-[63%]"
              preload="auto"
              playsInline
              autoPlay={true}
              muted
              loop
            >
              <source src="/video-devices.m4v" type="video/mp4" />
            </video>
          </div>
          {/* right section*/}
          <div className="flex-1 md:text-left text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold">
              Stream unlimited movies and Tv shows on your phone, tablet,
              laptop, and TV.
            </h2>
          </div>
        </div>
      </div>

      <div className="h-2 w-full bg-[#232323] " aria-hidden="true"></div>

                   {/*fourth section*/}
                   <div className="py-10 bg-black text-white">
        <div className="flex max-w-6xl mx-auto items-center justify-center md:flex-row flex-col px-4 md:px-2">
          {/*Left side */}
          <div className="flex-1">
            <div className="relative">
              <img
                src="/kids.png"
                alt="kids img"
                className="mt-4"
              />
 
            </div>
          </div>
          {/* right section*/}
          <div className="flex-1 md:text-left text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-balance">
              Create profiles for kids
            </h2>
            <p className="text-lg md:text-xl">
              send kids on adventures with their favorite character in a space made just for them
              -free with your membership.
            </p>
          </div>
        </div>
      </div>

    </>
  );
};

export default AuthHome;
