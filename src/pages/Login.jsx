import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';


const Login = () => {


  const [err, setErr] = useState(false);
  const navigate = useNavigate();  // to navigate

  //  Function called on Submit
  const handleSubmit = async (e) => {

    e.preventDefault();  // we don't want to reload our page on refresh

    // console.log(e.target[0].value);  // there are 2 target values.  we want to access 1st value
    const email = e.target[0].value;
    const password = e.target[1].value;

    try{
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    }
    catch(err){
      setErr(true);
    }
    

  };



  return (
    <div className='formContainer'>
      <div className="formWrapper">

        <span className="logo">Chat App</span>
        <span className="title">Login</span>

        <form onSubmit={handleSubmit} >
            <input type="email" placeholder='email...' />
            <input type="password" placeholder='password...' />

            <button>Sign In</button>
            { err && <span>Something went wrong</span> }

        </form>

        <p> You don't have an account? <Link to="/register" >Register</Link> </p>

      </div>
    </div>
  )
}

export default Login
