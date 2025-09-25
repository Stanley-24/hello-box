import React from 'react'
import { useAuthStore } from '../store/useAuthStore.js'

export default function ChatPage() {
  const {logout} = useAuthStore();
  return (
   
    <div className='z-10 btn btn-primary '>
      ChatPage
      <button className="z-10" onClick={logout}>LogOut</button>
    </div>
  )
}
