// as we will need user everywhere, we will use Context api Hook.
// Create Authentication Provider and also create user, which we will be able to use everywhere
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { auth } from "../firebase";


export const AuthContext = createContext();


export const AuthContextProvider = ({children}) => {

    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        const unsub = onAuthStateChanged(auth,(user) => {
            setCurrentUser(user);
            // console.log("User is Signed In")
            console.log(user);

            // if(user){
            //     console.log("User is Signed In")
            // }
            // else{
            //     console.log("User is Signed Out")

            // }
            
        })

        // If you are listening in a realtime operation, 
        // you should use a cleanup function, otherwise it will cause some memory leaking.
        return () => {
            unsub();
        };


    }, []);

    return (
        <AuthContext.Provider  value={{currentUser}}>
        {children}
        </AuthContext.Provider>
    );

}

//  we will wrap our whole app in this AuthContextProvider so that
// we will be able to use currentUser everyWhere in our app

// wrapped in index.js file


