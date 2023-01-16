// we will need combinedId and the other user Info everywhere, we will use Context api Hook.
import { useContext, useReducer } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";


export const ChatContext = createContext();



export const ChatContextProvider = ({children}) => {

    const { currentUser } = useContext(AuthContext);
    

     
    
    const INITIAL_STATE = {
        chatId:"null",
        user:{}
    };
    /*
        this will have
        {
            user:{}
            chatId
        }

        chatId is the combined id of both users, and user info is the info of the 2nd user
        as chatId depends on user info, we will use useReducer here
     */

        //state or data is the content of 2nd user which we can use anywhere
        // action is when to change the content of this state. 
        // (i.e when to change the data of the 2nd user we have)
        // while we click on their component we have to change the data of the 2nd user,
        // as whenever we click on their component, we want to chat with that person, so we need to change the 2nd user when we click on them
        const chatReducer = (state, action) => {
            switch(action.type) {
                case "CHANGE_USER":
                    return {
                        user: action.payload,
                        // can't get this uid from currentUser as it is null
                        chatId: 
                            currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                    };

                default:
                    return state;

            }
        };
    
        // console.log("currentUser in ChatContext")
        // console.log(currentUser)

    const [state,dispatch] = useReducer(chatReducer, INITIAL_STATE);
        

    return (
        <ChatContext.Provider  value={{data:state, dispatch }}>
        {children}
        </ChatContext.Provider>
    );

};

//  we will wrap our whole app in this AuthContextProvider so that
// we will be able to use currentUser everyWhere in our app

// wrapped in index.js file


