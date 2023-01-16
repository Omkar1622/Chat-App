// Display Multiple Messages from particular User
import React from 'react'
import Message from './Message'
import background from "../img/bg2.jpg"
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { useState } from 'react'
import { useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

const Messages = () => {

  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists()  &&  setMessages(doc.data().messages)
    })

    return () => {
      unSub();
    }

  }, [data.chatId])

  // data.chatId will change when we click on another user in chats

  console.log(messages);

  return (
    <div className='messages' style={{backgroundImage: `url(${background})`}}>

      {messages.map((m) => (
          <Message message={m} key={m.id} />
      ))}
      

    </div>
  )
}

export default Messages
