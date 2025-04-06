import React from 'react'
import AuthHome from './AuthHome'
import NoAuth from './NoAuth'
const OurHome = () => {
    const user=false
  return (
    <div >
    {!user?<AuthHome></AuthHome>:<NoAuth></NoAuth>}   
    </div>
  )
}

export default OurHome
