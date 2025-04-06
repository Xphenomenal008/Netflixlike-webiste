

import { Route,Routes } from "react-router-dom"
 
import OurHome from "./pages/home/OurHome"
import LoginPage from "./pages/authpages/LoginPage"
import SignUPPage from "./pages/authpages/SignUPPage"
import Footer from "./pages/components/Footer"


function App() {
 

  return (
    <>
    <Routes>
      <Route path="/" element={<OurHome></OurHome>}/>
      <Route path="/login" element={<LoginPage></LoginPage>}/>
      <Route path="/signup" element={<SignUPPage></SignUPPage>}/>
    </Routes> 
    <Footer></Footer>
    </>
  )
}

export default App
