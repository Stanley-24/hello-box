import React from 'react'
import { useChatStore } from '../store/useChatStore.js'
import BorderAnimatedContainer from '../components/borderAnimation.jsx';
import ProfileHeader from '../components/ProfileHeader.jsx';
import ActiveTabSwitch from '../components/ActiveTabSwitch.jsx';
import ChatsList from '../components/ChatsList.jsx';
import ContactsList from '../components/ContactsList.jsx';
import ChatContainer from '../components/ChatContainer.jsx';
import NoChatPlaceholder from '../components/noChatPlaceholder.jsx';

export default function ChatPage() {
  const {activeTab, selectedUser } = useChatStore();
  return (
   
    <div className='relative w-full max-w-6xl h-[800px]'>
      <BorderAnimatedContainer>
        {/* Left Side */}
        <div className='w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col'>
          <ProfileHeader/>
          <ActiveTabSwitch/>

          <div className='flex-1 overflow-y-auto p-4 space-y-2'>
            {activeTab === 'chats' ? <ChatsList/> : <ContactsList/>}
          </div>
        </div>

        {/* Right Side */}
        <div className='flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm'>
          {selectedUser ? <ChatContainer/> : <NoChatPlaceholder/>}
        </div>
      </BorderAnimatedContainer>
      
    </div>
  )
}
