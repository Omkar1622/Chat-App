import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { collection, query, where, getDocs, setDoc, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';

const Search = () => {

  const [username, setUsername] = useState("");  // for searchbox
  const [user, setUser] = useState(null);  // to store data which is given by query
  const [err, setErr] = useState(false);  // check error


  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);


  const handleSearch = async () => {

      // READ QUERY DOCUMENTATION
      // Create a reference to the users collection
      const userRef = collection(db, "users");
      // Create a query against the collection.
      const q = query(userRef, where("displayName", "==", username ));


      try {

        //  Execute a query
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          setUser(doc.data())
        });
        
      }
      catch(err) {
        setErr(true);
      }

  };

  const handleKey = (e) => {
      e.code === "Enter"  &&  handleSearch();
  };



  const handleSelect = async (u) => {
    
    // logic to concatenate both users userId 
    const combinedId = 
    currentUser.uid > user.uid
    ? currentUser.uid + user.uid
    : user.uid + currentUser.uid;
    
    try {
          // check whether the group(chats in firestore) exists [chats b/w specific 2 users]. if not, create new one
          const res = await getDoc(doc(db, "chats", combinedId));

          if(!res.exists()) {
            // create a chat in chats collection as it does not exist.
            await setDoc(doc(db, "chats", combinedId), { messages: [] });
          }

          /*
              "UserChats" collection in firebase Data Structure will look like this :-
               
              userChats:{

                janesId:{
                  // id of 2 specific users (one of them is jane in this case)
                  combinedId:{
                    // other users info, latest Msg, date
                    userInfo{
                      displayName,img,id
                    },

                    lastMessage: "",

                    date: 
                  }
                }
              }
          */

          // create user chats
          // check (Add data to cloud firestore => Update nested Objects) in documentation
          
          // Update the document in "userChats" with currentUser's id. we created this when we registered 
          // user here is the 2nd person 
          await updateDoc(doc(db,"userChats", currentUser.uid), {
            [combinedId+".userInfo"]: {
              uid: user.uid,
              displayName: user.displayName,
              photoURL: user.photoURL
            },
            [combinedId+".date"]: serverTimestamp()

          });

          // Update the document in "userChats" with user's id. we created this when we registered 
          await updateDoc(doc(db,"userChats", user.uid), {
            [combinedId+".userInfo"]: {
              uid: currentUser.uid,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL
            },
            [combinedId+".date"]: serverTimestamp()

          });

          // update the ChatContext api
          // did the same thing as did in Chats.js Page for ChatContext 
          // when we update the 
          dispatch({ type: "CHANGE_USER", payload: u })


        }
        catch(err) {
          setErr(true);
        }

        setUser(null);
        setUsername("");

  };



  return (
    <div className='search'>

      <div className="searchForm">
        <input 
          type="text" 
          placeholder='Find a user...' 
          onChange={e => setUsername(e.target.value)} 
          onKeyDown={handleKey} 
          value={username}
        />
      </div>

      {err && <span>User Not Found</span>}

    {/* If there is user, Show this div */}
    {/* When we click on this div, we will make connection b/w these 2 users */}
      {user  &&  <div className="userChat" onClick={() => handleSelect(user)}>
        <img src={user.photoURL} alt="" />
        <div className="userChatInfo">
          <span>{ user.displayName }</span>
        </div>
      </div>}

    </div>
  )
}

export default Search
