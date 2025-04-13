import React, { useEffect, useState } from 'react'
import { useContent } from '../store/content'
import axios from 'axios'

const usegetTrending = () => {
const {contentType}=useContent()
const [trending ,settrending]=useState(null)
console.log(`your trending ${trending}`)

useEffect(()=>{
    const gettrending=async()=>{
  const res=await axios.get(`/api/v1/${contentType}/trending`);
   settrending( res.data.content)
   console.log("MY"+res.data.content)
    }
   gettrending()
},[contentType])

   return {trending}
}

export default usegetTrending
