import React from 'react'
import { useAuthstore } from '../../store/zustand'

const NoAuth = () => {
  const {logout}=useAuthstore()
  const clickhandler=()=>{
      logout()
  }
  return (
    <div>
      hello from noauth
      <button onClick={clickhandler}>
        logout
      </button>
    </div>
  )
}

export default NoAuth
