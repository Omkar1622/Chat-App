import React from 'react'
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from '../firebase'; 
import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore"; 
import { useNavigate, Link } from 'react-router-dom';



const Register = () => {

  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // to navigate

  //  Function called on Submit
  const handleSubmit = async (e) => {

    setLoading(true);

    e.preventDefault();  // we don't want to reload our page on refresh

    // console.log(e.target[0].value);  // there are 4 target values.  we want to access 1st value
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try{
      // Firebase Authentication (Check Firebase Authentication documentation)
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Image Upload (read documentation of upload files with cloud storage)
      const storageRef = ref(storage, displayName);  //create a reference

      const uploadTask = uploadBytesResumable(storageRef, file); // upload file to that reference

      // Register three observers:
      uploadTask.on(
        
        (error) => {
          setErr(true);
        }, 
        () => {
          
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // console.log('File available at', downloadURL);

            // Update Profile which was null Before in res (Updates Name and Image of user)
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            //create user on firestore
            // Add the user Data to the Firestore (so that we can access them later)
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            // console.log("Doc Added\n" + res.user);


            //create empty userChats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {} );

            navigate("/");  // we will navigate to home page after successfully registered

          });
        }
      ); 
    }
    catch(err){
      setErr(true);
      setLoading(false);
    }
    

  };



  return (
    <div className='formContainer'>
      <div className="formWrapper">

        <span className="logo">Chat App</span>
        <span className="title">Register</span>

        <form onSubmit={handleSubmit}>
            <input required type="text" placeholder='Display Name ...' />
            <input required type="email" placeholder='email...' />
            <input required type="password" placeholder='password...' />

            <input required style={{display: "none"}} type="file" id='file' />
            <label htmlFor="file"> 
                <img src={Add} alt="" />
                <span> Add an Avatar </span>
            </label>

            <button disabled={loading}>Sign Up</button>

            {loading &&  "Uploading and Compressing the image, please wait..."}
            { err && <span>Something went wrong</span> }
        </form>

        <p> You do have an account? <Link to="/login" >Login</Link> </p>

      </div>
    </div>
  )
}

export default Register
