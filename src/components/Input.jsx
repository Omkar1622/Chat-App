import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext } from 'react';
import { useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { db, storage } from '../firebase';
import Attach from "../img/attach.png";
import Img from "../img/img.png";
import  uuid  from "react-uuid"  // Library which gives us unique id
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';



const Input = () => {

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {

    // if we want to send image and text msg both
    if(img){

      const storageRef = ref(storage, uuid()); // create a reference

      const uploadTask = uploadBytesResumable(storageRef, img ); // add img to that reference

      uploadTask.on(
        
        (error) => {
          // setErr(true);
        }, 
        () => {
          
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,  // added img here
              })
      
            });

          });
        }
      );



    }
    // If we want to send only text msg
    else{
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        })

      });

    }

    // Add this as the Latest message in the "userChats" as we will display it in chats.js
    // Add this in both users
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]:{
        text
      },

      [data.chatId + ".date"]: serverTimestamp()

    });

    // add also in Other User
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]:{
        text
      },

      [data.chatId + ".date"]: serverTimestamp()

    });

    // after we send msg, clear the usestate  
    setText("");
    setImg(null);
  }

  return (
    <div className='input'>
      
      <input
        type="text"
        placeholder='Type Something...'
        onChange={ e => setText(e.target.value)}
        value={text}

      />

      <div className="send">
        <img src={Attach} alt="" />

        <input 
          type="file" 
          style={{display:"none"}} 
          id="file"
          onChange={ e => setImg(e.target.files[0])}
          
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>

        <button onClick={handleSend}> Send </button>

      </div>


    </div>
  )
}

export default Input
