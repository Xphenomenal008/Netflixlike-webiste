import React, { useRef, useState } from "react";
import Navbar from "./Navbar";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ORG_IMG_URL } from "../../utils/constant";
import toast from "react-hot-toast";
import { useAuthstore } from "../../store/zustand";

const Searchpage = () => {
  const name = useRef();
  const [active, setactive] = useState("movie");
  const [mydata, setmydata] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const { user } = useAuthstore();

  const getdata = async () => {
    const val = name.current.value.trim();
    if (!val) {
      toast.error("Please enter something to search!");
      return;
    }

    try {
      setLoading(true); // start loading
      const res = await axios.get(`/api/v1/search/${active}/${val}`);
      setmydata(res.data.content);

      // ✅ Save search history
      if (user?._id && res.data.content.length > 0) {
        await axios.post(`/api/v1/search/addhistory`, {
          userId: user._id,
          id: res.data.content[0]?.id, // TMDB id
          title: val,
          searchtype: active,
          image: res.data.content[0]?.poster_path || res.data.content[0]?.profile_path || "",
        });
      }
    } catch (e) {
      console.log(e);
      if (e.response?.status === 404) {
        toast.error("Nothing found under this category!");
      } else {
        toast.error("An error occurred. Please try again!");
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  const mtab = (tab) => {
    setmydata([]);
    setactive(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getdata();
  };

  return (
    <div className="min-h-screen text-white bg-black">
      <Navbar />

      {/* Category Tabs */}
      <div className="flex justify-center items-center gap-4 mt-28 lg:mt-6">
        {["movie", "tv", "person"].map((tab) => (
          <button
            key={tab}
            onClick={() => mtab(tab)}
            className={`${
              active === tab ? "bg-[rgba(196,31,50,0.91)]" : "bg-slate-500/55"
            } p-3 rounded-sm capitalize`}
          >
            {tab === "tv" ? "TV Shows" : tab === "person" ? "People" : "Movies"}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex justify-center items-center mt-3 space-x-2">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={name}
            type="text"
            placeholder={`Search for ${active}...`}
            className="bg-slate-500/55 p-1 rounded-sm w-96 lg:w-[540px] outline-none text-white placeholder-gray-300"
          />
          <button
            type="submit"
            className="bg-[rgba(196,31,50,0.91)] p-2 text-white rounded-sm"
          >
            <Search />
          </button>
        </form>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="text-center text-xl mt-4">Loading...</div>
      )}

      {/* Results */}
      {!loading && mydata.length > 0 && (
        <div className="p-2 px-10 lg:px-28">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
            {mydata.map((item, index) => {
              if (!item.poster_path && !item.profile_path) return null;
              return active === "person" ? (
                <div key={index} className="bg-slate-700 p-3 rounded text-center font-bold">
                  <img
                    src={`${ORG_IMG_URL}${item.profile_path}`}
                    alt={item.name}
                    className="rounded-md mx-auto"
                  />
                  <p className="mt-2">{item.name}</p>
                </div>
              ) : (
                <Link to={`/watch/${item.id}`} key={index}>
                  <div className="bg-slate-700 p-3 rounded text-center font-bold">
                    <img
                      className="px-6 rounded-md mx-auto"
                      src={ORG_IMG_URL + item.poster_path}
                      alt="poster"
                    />
                    <p className="font-bold mt-2">{item.title || item.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchpage;
