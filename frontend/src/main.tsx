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

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
   <Routes>
    <Route path="/" element={<App/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/create-arts" element={<CreateArts/>}/>
    <Route path="/profile/:username" element={<Profile/>}/>
    <Route path="/art/:id" element={<Arts/>}/>
    <Route path="/home" element={<Navigate to="/" />} />
    <Route path="/settings" element={<Settings/>}/>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="*" element={<NoPage/>}/>
   </Routes>
  </BrowserRouter>
)
