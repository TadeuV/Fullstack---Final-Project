import { useState,useEffect } from 'react'
import './App.scss'
import {app,grocery,collection } from './utils/mongo.client'
import Signup from './components/Signup'
import Login from './components/Login'
import FrontPage from "./components/FrontPage";
import {Route,Routes, BrowserRouter,Navigate} from "react-router-dom"
import Footer from './components/Footer'
import Page404 from './components/Page404'
import PrivateRoutes from './utils/PrivateRoutes'
import {useAuthContext} from './hooks/useAuthContext'

function App() {
  const [users, setUsers] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const {user} = useAuthContext();

  useEffect(()=>{

    async function getGrocery(){
    
      const allGrocery = await grocery.functions.getAllGroceries()
      setGroceries(allGrocery)
    }

    getGrocery();
  },[])



  return (
    <div className="App">
      <BrowserRouter>
      {/* <Navbar></Navbar> */}
        <Routes>
        <Route element={<PrivateRoutes/>}>
          <Route exact path='/' element={user? <FrontPage></FrontPage>:<Navigate to='/user/login'/>}></Route>
        </Route>
        <Route exact path='/user/login' element={!user ? <Login></Login> : <Navigate to='/'/>}></Route>
        <Route exact path='/user/signup' element={!user ? <Signup></Signup>: <Navigate to='/'/>}></Route>
        <Route path='*' element={<Page404></Page404>}></Route>
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </div>
  )
}

export default App
