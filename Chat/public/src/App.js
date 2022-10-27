import React from 'react'
import Register from './Pages/Register'
import Chat from './Pages/Chat'
import Login from './Pages/Login'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import SetAvatar from './Pages/SetAvatar'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/setAvatar" element={<SetAvatar />} />

      </Routes>
    </BrowserRouter>
  )
}
