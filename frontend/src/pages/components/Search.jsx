import React, { useRef, useState, useCallback } from "react";
import Navbar from "./Navbar";
import { Search, Loader2, AlertCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ORG_IMG_URL } from "../../utils/constant";
import toast from "react-hot-toast";
import { useAuthstore } from "../../store/zustand";

const Searchpage = () => {
  const name = useRef();
  const [active, setactive] = useState("movie");
  const [mydata, setmydata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const { user } = useAuthstore();

  // Debounced search function
  const getdata = useCallback(async (query) => {
    const val = query.trim();
    if (!val) {
      setmydata([]);
      setSearched(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearched(true);

      const res = await axios.get(`/api/v1/search/${active}/${val}`);
      const content = res.data.content || [];
      setmydata(content);

      // Save search history
      if (user?._id && content.length > 0) {
        try {
          await axios.post(`/api/v1/search/addhistory`, {
            userId: user._id,
            id: content[0]?.id,
            title: val,
            searchtype: active,
            image: content[0]?.poster_path || content[0]?.profile_path || "",
          });
        } catch (historyError) {
          console.log("History save failed:", historyError);
        }
      }

      if (content.length === 0) {
        setError(`No ${active} found matching "${val}"`);
      }
    } catch (e) {
      console.log(e);
      if (e.response?.status === 404) {
        setError(`Nothing found under this category!`);
      } else {
        setError("An error occurred. Please try again!");
      }
      setmydata([]);
    } finally {
      setLoading(false);
    }
  }, [active, user]);

  const mtab = (tab) => {
    setmydata([]);
    setactive(tab);
    setSearched(false);
    setError(null);
    name.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.current) {
      getdata(name.current.value);
    }
  };

  const handleClear = () => {
    name.current.value = "";
    setmydata([]);
    setSearched(false);
    setError(null);
    name.current.focus();
  };

  return (
    <div className="min-h-screen text-white bg-black">
      <Navbar />

      <div className="px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-8">
        {/* Category Tabs - Responsive */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 lg:gap-4 mt-4 sm:mt-6">
          {["movie", "tv", "person"].map((tab) => (
            <button
              key={tab}
              onClick={() => mtab(tab)}
              className={`
                px-3 sm:px-4 py-2 rounded-md font-semibold text-sm sm:text-base
                transition-all duration-200 capitalize
                ${
                  active === tab
                    ? "bg-red-600 hover:bg-red-700 shadow-lg"
                    : "bg-slate-700/60 hover:bg-slate-600 text-gray-300"
                }
              `}
            >
              {tab === "tv" ? "TV Shows" : tab === "person" ? "People" : "Movies"}
            </button>
          ))}
        </div>

        {/* Search Bar - Responsive */}
        <div className="flex justify-center items-center mt-4 sm:mt-6 px-2">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={name}
                  type="text"
                  placeholder={`Search for ${active}...`}
                  className={`
                    w-full bg-slate-700/50 hover:bg-slate-700 
                    border border-slate-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3
                    text-white placeholder-gray-400 text-sm sm:text-base
                    focus:outline-none focus:ring-2 focus:ring-red-500 
                    focus:border-transparent transition-all duration-200
                  `}
                  onSubmit={handleSubmit}
                  onInput={(e) => {
                    // Optional: Auto-search on input with debounce
                    // Removed for now, user must click search button
                  }}
                />
                {name.current?.value && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-600/50 rounded-md transition-colors"
                  >
                    <X size={18} className="text-gray-400" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
                  p-2 sm:p-3 rounded-lg font-semibold transition-all duration-200
                  flex items-center justify-center
                  ${
                    loading
                      ? "bg-red-700 cursor-not-allowed opacity-75"
                      : "bg-red-600 hover:bg-red-700 active:scale-95"
                  }
                `}
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center mt-12">
            <Loader2 className="animate-spin text-red-600 mb-3" size={40} />
            <p className="text-gray-400 text-sm sm:text-base">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mt-8 max-w-2xl mx-auto px-2">
            <div className="flex items-start gap-3 bg-red-600/20 border border-red-500/50 rounded-lg p-4">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold">{error}</p>
                <p className="text-gray-400 text-sm mt-1">Try a different query or category</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid - Fully Responsive */}
        {!loading && mydata.length > 0 && (
          <div className="mt-8 px-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              {mydata.map((item, index) => {
                if (!item.poster_path && !item.profile_path) return null;

                return active === "person" ? (
                  <div
                    key={index}
                    className="bg-slate-800/60 hover:bg-slate-700 p-2 sm:p-3 rounded-lg 
                               transition-all duration-200 hover:scale-105 cursor-pointer
                               border border-slate-700 hover:border-red-600/50"
                  >
                    <img
                      src={`${ORG_IMG_URL}${item.profile_path}`}
                      alt={item.name}
                      className="rounded-md w-full aspect-square object-cover"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <p className="mt-2 text-xs sm:text-sm font-semibold line-clamp-2 text-center">
                      {item.name}
                    </p>
                  </div>
                ) : (
                  <Link
                    to={`/watch/${item.id}`}
                    key={index}
                    className="group"
                  >
                    <div className="bg-slate-800/60 hover:bg-slate-700 p-2 sm:p-3 rounded-lg 
                                   transition-all duration-200 hover:scale-105
                                   border border-slate-700 hover:border-red-600/50 cursor-pointer
                                   h-full flex flex-col"
                    >
                      <img
                        className="rounded-md w-full aspect-video object-cover group-hover:shadow-lg"
                        src={ORG_IMG_URL + item.poster_path}
                        alt={item.title || item.name}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <p className="text-xs sm:text-sm font-semibold mt-2 line-clamp-2 group-hover:text-red-400 
                                   transition-colors">
                        {item.title || item.name}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {item.release_date?.split("-")[0] || "N/A"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <p className="text-center text-gray-400 text-sm mt-6">
              Found {mydata.length} result{mydata.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && searched && mydata.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center mt-12 text-center px-4">
            <Search size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-base sm:text-lg">No results found</p>
            <p className="text-gray-500 text-sm mt-2">Try searching with different keywords</p>
          </div>
        )}

        {/* Initial State */}
        {!searched && mydata.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center mt-20 text-center px-4">
            <Search size={48} className="text-gray-600 mb-4" />
            <p className="text-gray-400 text-base sm:text-lg">Search for your favorite {active}</p>
            <p className="text-gray-500 text-sm mt-2">Enter a title and press search</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchpage;
