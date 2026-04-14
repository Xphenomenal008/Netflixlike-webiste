import React, { useState } from 'react';
import { Search, LogOut, Menu, X } from 'lucide-react';
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

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black via-black/80 to-transparent backdrop-blur-sm border-b border-white/5">
        <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl w-full">
          {/* Logo */}
          <Link to={"/"} className="flex-shrink-0">
            <img 
              src="/logo-transparent.png" 
              className="w-32 sm:w-40 lg:w-56 object-contain" 
              alt="Netflix Clone Logo" 
            />
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden z-50 p-2 hover:bg-white/10 rounded-lg transition-colors" 
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center gap-6 text-white px-8">
            <Link 
              to={"/"} 
              onClick={() => setcontenttype("movies")} 
              className="hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Movies
            </Link>
            <Link 
              to={"/"} 
              onClick={() => setcontenttype("tvshow")} 
              className="hover:text-red-600 transition-colors duration-200 font-medium"
            >
              TV Shows
            </Link>
            <Link 
              to={"/searchhistory"} 
              className="hover:text-red-600 transition-colors duration-200 font-medium"
            >
              Search History
            </Link>
            
            {/* AI Pick Button with Gradient Border */}
            <Link
              to={"/recommend"}
              className="relative inline-flex items-center justify-center rounded-full p-[2px] overflow-hidden group"
            >
              <span className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#e50914,#f43f5e,#a855f7,#22d3ee,#e50914)] animate-spin-slow"></span>
              <span className="relative z-10 bg-black rounded-full px-5 py-2 text-white font-semibold flex items-center gap-1 group-hover:bg-black/80 transition-colors">
                🤖 AI Pick
              </span>
            </Link>
          </nav>

          {/* Desktop Icons */}
          <div className="hidden lg:flex gap-4 items-center text-white">
            <Link 
              to={"/search"} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <Search size={20} />
            </Link>
            
            {user?.image && (
              <img 
                src={user.image} 
                className="h-10 rounded-full border-2 border-red-600 cursor-pointer hover:border-red-500 transition-colors" 
                alt={user?.username || "user"} 
                title={user?.username}
              />
            )}
            
            <button 
              onClick={clickhandler}
              className="p-2 hover:bg-red-600/20 rounded-lg transition-colors duration-200 text-gray-300 hover:text-red-600"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu - Sliding from top */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 animated-in fade-in slide-in-from-top z-40">
            <nav className="flex flex-col gap-3 p-4 sm:p-6 text-white">
              <Link 
                to={"/"} 
                onClick={() => { setcontenttype("movies"); closeMenu(); }} 
                className="px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                🎬 Movies
              </Link>
              <Link 
                to={"/"} 
                onClick={() => { setcontenttype("tvshow"); closeMenu(); }} 
                className="px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                📺 TV Shows
              </Link>
              <Link 
                to={"/searchhistory"} 
                onClick={closeMenu}
                className="px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                🔍 Search History
              </Link>
              
              <Link
                to={"/recommend"}
                onClick={closeMenu}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold flex items-center gap-2"
              >
                🤖 AI Pick
              </Link>
            </nav>

            {/* Mobile User Info */}
            <div className="flex gap-4 items-center p-4 sm:p-6 pt-2 sm:pt-3 text-white border-t border-white/10">
              <Link 
                to={"/search"}
                onClick={closeMenu}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Search size={20} />
              </Link>
              
              {user?.image && (
                <img 
                  src={user.image} 
                  className="h-10 rounded-full border-2 border-red-600 cursor-pointer" 
                  alt={user?.username || "user"}
                  title={user?.username}
                />
              )}
              
              <button 
                onClick={() => { clickhandler(); closeMenu(); }}
                className="ml-auto p-2 hover:bg-red-600/20 rounded-lg transition-colors text-gray-300 hover:text-red-600"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
