import React, { useRef, useState } from "react";
import Navbar from "./Navbar";
import {  Search } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ORG_IMG_URL } from "../../utils/constant";
import toast from "react-hot-toast";

const Searchpage = () => {
  const name = useRef();
  const [active, setactive] = useState("movie");
  const [mydata, setmydata] = useState([]);

  const getdata = async () => {
    const val = name.current.value;
    try {
      const res = await axios.get(`/api/v1/search/${active}/${val}`);
      setmydata(res.data.content);

    } catch (e) {
      console.log(e);
      if(e.response?.status===404){
        toast.error("Nothing is Found ,Make sure you are searching under right category!")
      }else{
        toast.error("An error has occured, please try again later!")
      }
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
      <div className="btn flex justify-center items-center text-white gap-4 mt-28 lg:mt-6">
        <button
          onClick={() => mtab("movie")}
          className={`${
            active === "movie" ? "bg-[rgba(196,31,50,0.91)]" : "bg-slate-500/55"
          } p-3 rounded-sm`}
        >
          Movies
        </button>
        <button
          onClick={() => mtab("tv")}
          className={`${
            active === "tv" ? "bg-[rgba(196,31,50,0.91)]" : "bg-slate-500/55"
          } p-3 rounded-sm`}
        >
          TV Shows
        </button>
        <button
          onClick={() => mtab("person")}
          className={`${
            active === "person" ? "bg-[rgba(196,31,50,0.91)]" : "bg-slate-500/55"
          } p-3 rounded-sm`}
        >
          People
        </button>
      </div>

      <div className="flex justify-center items-center mt-3 gap-1">
        <form
          onSubmit={handleSubmit}
          className="flex justify-center items-center"
        >
          <input
            ref={name}
            type="text"
            className="bg-slate-500/55 p-1 rounded-sm w-96 lg:w-[540px]"
          />
          <button className="bg-[rgba(196,31,50,0.91)] p-1 text-white rounded-sm">
            <Search />
          </button>
        </form>
      </div>

      {/* Displaying search results */}
      <div className="p-2 px-28">
  {mydata.length > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {mydata.map((item, index) => {
        if (!item.poster_path && !item.profile_path) return null;

        return active === "person" ? (
          <div key={index} className=" bg-slate-700 p-3 rounded text-center font-bold">
            <img
              src={`${ORG_IMG_URL}${item.profile_path}`}
              alt={item.name}
              className="rounded-md"
            />
            <p>{item.name}</p>
          </div>
        ) : (
          <Link to={`/watch/${item.id}`} key={index}>
            <div className="bg-slate-700 p-3 rounded text-center font-bold">
              <img
                className="px-6"
                src={ORG_IMG_URL + item.poster_path}
                alt="img"
              />
              <p className="font-bold">{item.title || item.name}</p>
            </div>
          </Link>
        );
      })}
    </div>
  )}
</div>



    </div>
  );
};

export default Searchpage;
