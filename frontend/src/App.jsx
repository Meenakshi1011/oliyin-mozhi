import './App.css'
import SignIn from './components/Signin/Signin'
import React, { useState } from 'react';
import Homepage from './components/Homepage/Homepage'
import Content from  './components/Homepage/Content'
import Displayblog from  './components/Homepage/Displayblog'
import Writeblog from  './components/Homepage/Writeblog'

import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './components/Profile/Profile';
import Usercontent from './components/Profile/Usercontent';
import Manageblog from './components/Profile/Manageblog';
import Updateblog from './components/Profile/Updateblog';
import Viewprofile from './components/Viewprofile/Viewprofile';
import ViewUserBlogs from './components/Viewprofile/ViewUserBlogs';
import PasswordResetConfirm from './components/Signin/PasswordResetConfirm';

function App() {
   const [search, setSearch] = useState('');

  return (
     <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='home' element={
         <>
               <Homepage search={search} setSearch={setSearch} />
               <Content  search={search} />
         </>

         } />
        <Route path="/Displayblog/:id" element={<Displayblog />} />
        <Route path="/Writeblog" element={<Writeblog />} />
        <Route path="/profile" element={
         <>
         < Profile/>
         < Usercontent />
         </>
         } />
         <Route path="/password-reset-confirm" element={<PasswordResetConfirm />} />
         <Route path='/Manageblog/:id' element={<Manageblog />} />
         <Route path='/Updateblog/:id' element={<Updateblog />} />
         <Route path='/Viewprofile/:user_id' element={
            <>
            <Viewprofile />
            <ViewUserBlogs />
            </>
         }/>


     </Routes>
  )
}

export default App
