import React, { useEffect } from 'react'
import ChatPage from './pages/ChatPage.jsx'
import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import PageLoader from './components/PageLoader.jsx'
import { Toaster } from 'react-hot-toast'

function App() {

 const {isCheckingAuth, checkAuth, authUser } = useAuthStore()

 useEffect (() => {
  checkAuth()
 }, [checkAuth]);

 if (isCheckingAuth) return <PageLoader />;


  return (

    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>

    {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8a8a8a1f_1px,transparent_1px),linear-gradient(to_bottom,#8a8a8a1f_1px,transparent_1px)] bg-[size:26px_26px]" />
      <div className="absolute -top-16 -left-16 size-[36rem] bg-orange-500 opacity-30 blur-[150px]" />
      <div className="absolute -bottom-16 -right-16 size-[36rem] bg-purple-500 opacity-30 blur-[150px]" />

   

     <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" />} />
      </Routes>

      {/* ✅ Must be outside Routes */}
      <Toaster />

    </div>
  )
}

export default App
