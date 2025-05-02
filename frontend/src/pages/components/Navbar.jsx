import React, { useState } from 'react';
import { Search, LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthstore } from '../../store/zustand';
import { useContent } from '../../store/content';

const Navbar = () => {
  const { user } = useAuthstore();
  const [isOpen, setIsOpen] = useState(false);
  const { contentType, setcontenttype } = useContent();
  const { logout } = useAuthstore();

  const clickhandler = () => {
    logout();
  };

  return (
    <>
      <header className="relative z-50">
        <div className="flex justify-between items-center h-20  md:h-28 mx-auto max-w-6xl">
          <Link to={"/"}>
            <img src="/logo-transparent.png" className=" flex justify-start items-start p-0 w-40 md:w-60" alt="logo" />
          </Link>

          <button className="md:hidden z-50" onClick={() => setIsOpen(!isOpen)}>
            <Menu size={28} />
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex md:items-center gap-6 text-white px-16">
            <Link to={"/"} onClick={() => setcontenttype("movies")} className="hover:underline">
              Movies
            </Link>
            <Link to={"/"} onClick={() => setcontenttype("tvshow")} className="hover:underline">
              Tv Show
            </Link>
            <Link to={"/searchhistory"} onClick={() => setcontenttype("tvshow")} className="hover:underline">
              Search History
            </Link>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden md:flex gap-3 items-center text-white ">
            <Link to={"/search"}>
              <Search />
            </Link>
            <img src={user?.image} className="h-8 cursor-pointer" alt="user" />
            <LogOut onClick={clickhandler} />
          </div>
        </div>

        {/* Mobile Menu - Transparent dropdown overlay */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full backdrop-blur-sm bg-white/10 px-4 py-6 flex flex-col gap-4 md:hidden z-40">
            <nav className="flex flex-col gap-3 text-white">
              <Link to={"/"} onClick={() => { setcontenttype("movies"); setIsOpen(false); }} className="hover:underline">
                Movies
              </Link>
              <Link to={"/"} onClick={() => { setcontenttype("tvshow"); setIsOpen(false); }} className="hover:underline">
                Tv Show
              </Link>
              <Link to={"/searchhistory"} onClick={() => { setcontenttype("tvshow"); setIsOpen(false); }} className="hover:underline">
                Search History
              </Link>
            </nav>

            <div className="flex gap-4 items-center pt-2 text-white">
              <Link to={"/search"}>
                <Search />
              </Link>
              <img src={user?.image} className="h-8 cursor-pointer" alt="user" />
              <LogOut onClick={clickhandler} />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
