

import { Navigate, Route,Routes } from "react-router-dom"
 
import OurHome from "./pages/home/OurHome"
import LoginPage from "./pages/authpages/LoginPage"
import SignUPPage from "./pages/authpages/SignUPPage"
import Footer from "./pages/components/Footer"
import { Toaster } from "react-hot-toast"
import { useAuthstore } from "./store/zustand"
import { useEffect } from "react"
import { Loader, Search } from "lucide-react"
import Watch from "./pages/home/Watch"
import Searchpage from "./pages/components/Search"
import Searchhistory from "./pages/components/Searchhistory"
import Error from './pages/components/Error'


function App() {
  const{user,ischeckingauth,authcheck}=useAuthstore();
  console.log(`home page user is ${user}`)

  useEffect(() => {
    authcheck()
      .then(() => console.log("User after authcheck:", user))
      .catch((err) => console.log("Authcheck error:", err));
  }, [authcheck]);

  if(ischeckingauth){
    return(
      <div className="h-screen">
        <div className="flex justify-center items-center bg-black h-full">
          <Loader className="animate-spin text-red-600 size-10"/>
        </div>
      </div>
    )
  }


  

  return (
    <>
    <Routes>
      <Route path="/" element={<OurHome></OurHome>}/>
      <Route path="/login" element={!user?<LoginPage></LoginPage>:<Navigate to={"/"}/>}/>
      <Route path="/signup" element={!user?<SignUPPage></SignUPPage>:<Navigate to={"/"}/>}/>
      <Route path="/watch/:id" element={user?<Watch></Watch>:<Navigate to={"/"}/>}/>
      <Route path="/search" element={user?<Searchpage></Searchpage>:<Navigate to={"/"}/>}/>
      <Route path="/searchhistory" element={user?<Searchhistory></Searchhistory>:<Navigate to={"/"}/>}/>
      <Route path="/*" element={<Error></Error>}/>

      </Routes>
    <Footer></Footer>
    <Toaster></Toaster>
    </>
  )
}

export default App
