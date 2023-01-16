import { doc, onSnapshot } from 'firebase/firestore';
import React from 'react'
import { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db } from '../firebase';

const Chats = () => {


  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  // console.log("currentUser in Chats")
  // console.log(currentUser)
    
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {


    const getChats = () => {
      // It is a realtime Update
      // Check (Get realtime updates with Cloud Firestore) documentation  
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      
      return () => {
        unsub();
      }
      
    };

    // call getChats only when currentUser's uid is not null
    currentUser.uid && getChats();

  }, [currentUser.uid]);

  // Now the data in chats is in object Type
  // so change it to array type while mapping.
  // Object.entries(chats) helps us to convert it into array

  console.log("Object.entries in chats");
  console.log(Object.entries(chats));


  const handleSelect = (u) => {
      dispatch({ type: "CHANGE_USER", payload: u })  
  }

  // when we click on any user(userChat div), the chatId and user data is changed.
  //  As the chatId is changed the useEffect hook in the Messages.jsx file fetch all the messages and display it.

  return (
    <div className='chats'>

      {/* each element of array has 2 values, first is combinedId, second is the Object which has 2nd user's info and date and last msg */}
      {/* sort is used to arrange components based on date in the chats section, so that recent msg chat component will come above */}
      {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date ).map((chat) => (

        <div className="userChat" key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
        <img src={chat[1].userInfo.photoURL} alt="" />
        <div className="userChatInfo">
          <span> { chat[1].userInfo.displayName } </span>
          <p> {chat[1].lastMessage?.text} </p>
        </div>
      </div>

      ))}
      


    </div>
  )
}

export default Chats
