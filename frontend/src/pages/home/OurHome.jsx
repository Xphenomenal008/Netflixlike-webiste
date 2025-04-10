import React from 'react'
import AuthHome from './AuthHome'
import NoAuth from './NoAuth'
import { useAuthstore } from '../../store/zustand'
const OurHome = () => {
    const {user}=useAuthstore()
    console.log(`your user is ${user}`)
  return (
    <div >
    {!user?<AuthHome></AuthHome>:<NoAuth></NoAuth>}   
    </div>
  )
}

export default OurHome
