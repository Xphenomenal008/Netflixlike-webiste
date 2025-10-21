import React, { useEffect, useState } from "react";
import { useAuthstore } from "../../store/zustand";
import { SMALL_IMG_URL } from "../../utils/constant";
import { Trash } from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import toast from "react-hot-toast";

const Searchhistory = () => {
  const { user } = useAuthstore();
  const [searchres, setSearchres] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ add loading

  const fetchSearchHistory = async () => {
    try {
      if (user?._id) {
        setLoading(true); // start loading
        const res = await axios.get(`/api/v1/search/history`);
        setSearchres(res.data.history || []);
      }
    } catch {
      toast.error("Failed to fetch search history");
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, [user]);

  const formatCreatedAt = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleclick = async (itemId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/v1/search/searchhistsorydelete/${itemId}`);
      toast.success("Deleted Successfully");
      setSearchres((prev) => prev.filter((item) => item.id !== itemId));
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='h-screen text-white relative'>
        <Navbar></Navbar>
         
         <div className='absolute top-0 left-0 w-full h-full bg-black/70 flex items-center justify-center -z-10 shimmer'></div>


      </div>
    );
  }

  if (!searchres.length) {
    return (
      <div className="h-screen bg-black text-white">
        <Navbar />
        <div className="text-center mt-8 text-3xl font-bold">
          No Search History Found! 🙄
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 px-6 py-2">
        {searchres.map((res) => (
          <div
            key={res.id}
            className="bg-slate-700 p-3 rounded flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={SMALL_IMG_URL + res.image}
                alt="img"
              />
              <div>
                <div className="font-semibold">{res.title}</div>
                <div className="text-sm text-slate-400">
                  {formatCreatedAt(res.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div
                className={`${
                  res.searchtype === "person" ? "bg-blue-700" : "bg-green-600"
                } text-white text-sm px-2 py-1 rounded-full`}
              >
                {res.searchtype}
              </div>
              <Trash
                onClick={() => handleclick(res.id)}
                className="cursor-pointer text-red-500 hover:text-red-700"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Searchhistory;
