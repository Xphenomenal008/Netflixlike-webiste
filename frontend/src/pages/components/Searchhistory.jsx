import React, { useEffect, useState } from 'react';
import { useAuthstore } from '../../store/zustand';
import { SMALL_IMG_URL } from '../../utils/constant';
import { Trash } from 'lucide-react';
import Navbar from './Navbar';
import axios from 'axios';
import toast from 'react-hot-toast';

const Searchhistory = () => {
  const { user } = useAuthstore();  
  const [searchres, setSearchres] = useState([]);

  
  useEffect(() => {
    if (user && user.searchHistory) {
      setSearchres(user.searchHistory);
    }
  }, [user]);

  const formatCreatedAt = (isoDate) => {
    const date = new Date(isoDate);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  const handleclick = async (id) => {
    try {
      await axios.get(`/api/v1/search/searchhistsorydelete/${id}`);
      toast.success("Deleted Successfully");
      setSearchres(prev => prev.filter(item => item.id !== id));
      
      
    } catch (e) {
      toast.error("Server error");
    }
  };

  return (
    <div className='h-screen bg-black text-white'>
      <Navbar />
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 px-6 py-2'>
        {
          searchres.map((res, index) => (
            <div key={index} className="bg-slate-700 p-3 rounded text-center font-bold flex justify-between sm:justify-evenly items-center text-white">
              <div className="main flex justify-center items-center gap-3">
                <div className="img">
                  <img className='h-16 w-16 rounded-full' src={SMALL_IMG_URL + res.image} alt="img" />
                </div>
                <div className="text">
                  <div className="name p-1">{res.title}</div>
                  <div className="date text-sm font-light text-slate-400">{formatCreatedAt(res.createdAt)}</div>
                </div>
              </div>
              <div className="type flex flex-col justify-center items-center gap-2">
                <div className={`${res.searchtype === "person" ? 'bg-blue-700' : 'bg-green-600'} text-white text-sm p-1 font-normal rounded-full px-2`}>{res.searchtype}</div>
                <div onClick={() => handleclick(res.id)} className="btn cursor-pointer">
                  <Trash className='fill-red-700 text-red-500 h-5' />
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Searchhistory;
