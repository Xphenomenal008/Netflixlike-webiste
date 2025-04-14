import React, { useState } from 'react';
import { Search, LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthstore } from '../../store/zustand';
import { useContent } from '../../store/content';

const Navbar = () => {
  const { user } = useAuthstore();
  const [isOpen, setIsOpen] = useState(false); // hamburger menu toggle
  const {contentType,setcontenttype}=useContent()
  const {logout}=useAuthstore()
  const clickhandler=()=>{
    logout()
}
  console.log(contentType)

  return (
    <>
      <header className="flex justify-between items-center h-20 mx-auto p-4 flex-wrap max-w-6xl relative z-50">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link to={"/"}>
            <img src="/netflix-logo.png" className="w-32 sm:w-40" alt="logo" />
          </Link>

          {/* Hamburger icon - shows only on small screens */}
          <button
            className="md:hidden z-50 "
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={28}/>
          </button>
        </div>

        {/* Menu items */}
        <nav
          className={`w-full md:flex md:items-center md:w-auto transition-all duration-300 ease-in-out ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mt-4 md:mt-0">
            <Link to={"/"} onClick={()=>setcontenttype("movies")}  className="hover:underline">
              Movies
            </Link>
            <Link to={"/"}  onClick={()=>setcontenttype("tvshow")} className="hover:underline">
              Tv Show
            </Link>
            <Link to={"/"}  onClick={()=>setcontenttype("tvshow")} className="hover:underline">
              Search History
            </Link>
          </div>
        </nav>

        {/* Right Side Icons */}
        <div className="flex gap-3 items-center mt-4 md:mt-0 ">
          <Link to={"/"}>
            <Search />
          </Link>
          <img src={user?.image} className="h-8 cursor-pointer  l" alt="user" />
          <LogOut onClick={clickhandler} />
        </div>
      </header>
    </>
  );
};

export default Navbar;
