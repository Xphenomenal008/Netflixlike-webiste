
import { Navigate, Route, Routes } from "react-router-dom"
 
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
import Ai_prediction from "./pages/home/Ai_prediction"

function App() {
  const { user, ischeckingauth, authcheck } = useAuthstore();

  useEffect(() => {
    authcheck();
  }, [authcheck]);

  if (ischeckingauth) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin text-red-600 size-10" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Routes>
        <Route path="/" element={<OurHome />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!user ? <SignUPPage /> : <Navigate to={"/"} />} />
        <Route path="/watch/:id" element={user ? <Watch /> : <Navigate to={"/login"} />} />
        <Route path="/search" element={user ? <Searchpage /> : <Navigate to={"/login"} />} />
        <Route path="/searchhistory" element={user ? <Searchhistory /> : <Navigate to={"/login"} />} />
        <Route path="/recommend" element={<Ai_prediction />} />
        <Route path="/*" element={<Error />} />
      </Routes>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  )
}

export default App
