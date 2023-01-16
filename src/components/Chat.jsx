// Right Side of our App

import React, { useContext } from 'react'
// import Cam from '../img/camera.png';
// import AddFriend from '../img/friend.png';
// import More from '../img/more.png';
import Messages from './Messages';
import Input from './Input'

import { FaVideo } from 'react-icons/fa';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { FiMoreHorizontal } from 'react-icons/fi';
import { ChatContext } from '../context/ChatContext';


const Chat = () => {

  const { data } = useContext(ChatContext);
  // data has 2 parts, "chatId" and "user".  Check in ChatContext.js Page

  // console.log("data in Chat.js");
  // console.log(data);


  return (  
    <div className='chat'>

      {/* Right side Header part */}
      <div className="chatInfo">

        <span> { data.user?.displayName} </span>

        <div className="chatIcons">
            <p><FaVideo/></p>
            <p><MdPersonAddAlt1/></p>
            <p><FiMoreHorizontal/></p>
            {/* <img src={Cam} alt="" /> */}
            {/* <img src={AddFriend} alt="" /> */}
            {/* <img src={More} alt="" /> */}
        </div>

      </div>

      {/* Messages Part */}
      <Messages />

      {/* Input Section */}
      <Input />
        
    </div>
  );
};

export default Chat
