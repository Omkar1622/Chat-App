import React from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext';

const Message = ({message}) => {

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  console.log("date");
  console.log(message.date);

  // whenever we create new message, we should scroll down to that message
  // we will use useRef hook  and useEffect hook for that
  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({behavior:"smooth"})
  },[message])


  // Generate a Date from Timestamp
  // we have timestamp in seconds in the message.date , now we want to convert it into date
  // unix timestamp
      var timestamp = message.date.seconds;
      // convert unix timestamp to milliseconds
      var timestamp_ms = timestamp * 1000;
      // initializing the Date object
      var d_obj = new Date(timestamp_ms);
      // extracting date from the date object as 2 digit
      var date = ("0" + d_obj.getDate()).slice(-2);
      // extracting hours from the date object as 2 digit
      var hrs = ("0" + d_obj.getHours()).slice(-2);
      // extracting minutes from the date object as 2 digit
      var mins = ("0" + d_obj.getMinutes()).slice(-2);
      // extracting the seconds from the date object as 2 digit
      var sec = ("0" + d_obj.getSeconds()).slice(-2);
      // extracting year from the date object as 4 digit
      var yr = d_obj.getFullYear();
      // extracting month from the date object as 2 digit
      var mth = ("0" + (d_obj.getMonth() + 1)).slice(-2);

      var final_date = date + "/" + mth + "/" + yr ;
      var final_time =  hrs + ":" + mins + ":" + sec;
      console.log(final_date);
      console.log(final_time);


      
  return (
    <div ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
          <img 
            src={ message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL } 
            alt=""
          />

          <span> {final_date} </span>
          <span> {final_time} </span>
      </div>
      
      <div className="messageContent">
          <p>{message.text}</p>
          {message.img &&  <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message
