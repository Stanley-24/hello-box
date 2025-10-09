import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import { useAuthStore } from '../store/useAuthStore'
import NoChatHistoryPlaceHolder from '../components/NoChatHistoryPlaceHolder'
import MessagesInput from '../components/messagesInput'
import MessagesLoadingSkeleton from '../components/MessagesLoadingSkeleton'
function ChatContainer() {
  const {selectedUser, getMessagesByUserId, messages, isMessagesLoading} = useChatStore()
  const {authUser} = useAuthStore()

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);


  return (
    <>
      <ChatHeader />
      <div className='flex-1 px-6 overflow-y-auto py-8'>
        {messages.length > 0 && !isMessagesLoading? (
          <div className='max-w-3xl mx-auto space-y-6'>
            {messages.map((msg) => (
              <div key={msg._id}
                className={`chat ${msg.sender === authUser._id ? 'chat-end' : 'chat-start'}`}
              >
                <div className={
                  `chat-bubble relative ${
                    msg.sender === authUser._id ?
                     'bg-cyan-600 text-white' 
                     : 'bg-slate-800 text-slate-200'
                  }`
                }>
                  {msg.image && (
                    <img src={msg.image} 
                    alt="Sent Image" 
                    className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && (
                    <p className='mt-2'>
                      {msg.text}
                    </p>
                  )}
                  <p className='text-xm mt-1 opacity-75 flex items-center gap-1'>
                    {new Date(msg.createdAt).toISOString().slice(11, 16)}
                  </p>

                </div>

              </div>
            ))}

          </div>
        ) : isMessagesLoading ? <MessagesLoadingSkeleton />  : (
          <NoChatHistoryPlaceHolder name={selectedUser.fullname} />
        )}
      </div>

      <MessagesInput />
    </>
  )
}

export default ChatContainer
