import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Register from './Pages/Register.tsx'
import Login from './Pages/Login.tsx'
import CreateArts from './Pages/CreateArts.tsx'
import Profile from './Pages/Profile.tsx'
import Arts from './Pages/Arts.tsx'
import NoPage from './Pages/NoPage.tsx'
import Settings from './Pages/Settings.tsx'
import Admin from './Pages/Admin.tsx'
import Search from './Pages/Search.tsx'
import ForgotPassword from './Pages/Password/forgotPassword.tsx'
import ResetPassword from './Pages/Password/resetPassword.tsx'
import Contact from './Pages/Contact.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<App/>}/>
    {/* AUTH */}
    <Route path="/register" element={<Register/>}/>
    <Route path="/login" element={<Login/>}/>

    {/* FUNCTIONAL's */}
    <Route path="/create-arts" element={<CreateArts/>}/>
    <Route path="/profile/:username" element={<Profile/>}/>
    <Route path="/art/:id" element={<Arts/>}/>
    <Route path="/settings" element={<Settings/>}/>
    <Route path="/search" element={<Search/>}/>
    <Route path="/contact" element={<Contact/>}/>
    
    {/* PASSWORD ETC */}
    <Route path="/forgot-password" element={<ForgotPassword/>}/>
    <Route path="/reset-password/:token" element={<ResetPassword/>}/>

    {/* ADMIN ETC. */}
    <Route path="/admin" element={<Admin/>}/>

    <Route path="/home" element={<Navigate to="/" />} />
    <Route path="*" element={<NoPage/>}/>
   </Routes>
  </BrowserRouter>
)
