import React from 'react'
import ChatPage from './pages/ChatPage'
import { Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useAuthStore } from './store/useAuthStore'

function App() {

   const {authUser, isLoggedIn, login} =useAuthStore();

  console.log("isLogin:", isLoggedIn),
  console.log("auth User:", authUser)

  return (

    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>

    {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8a8a8a1f_1px,transparent_1px),linear-gradient(to_bottom,#8a8a8a1f_1px,transparent_1px)] bg-[size:26px_26px]" />
      <div className="absolute -top-16 -left-16 size-[36rem] bg-orange-500 opacity-30 blur-[150px]" />
      <div className="absolute -bottom-16 -right-16 size-[36rem] bg-purple-500 opacity-30 blur-[150px]" />

      <button onClick={login} className='z-0 btn btn-primary btn-sm z-10'>
        Login
      </button>


      <Routes>
        <Route path="/" element={<ChatPage />} />,
        <Route path="/login" element={<LoginPage />} />,
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

    </div>
  )
}

export default App
