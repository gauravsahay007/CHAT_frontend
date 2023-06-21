import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { API } from "../backend";
import { getOtherUsers } from '../configuration/logic';
import { GetNotification, RemoveNotification } from '../Helper';
import { SendNotification } from '../Components/Helper';

const ChatContext=createContext("");

const ChatProvider=({children})=>{

    const navigate = useNavigate();

    const [chats,setChats]=useState();
    const [error,setError]=useState();
    const [user,setUser]=useState(JSON.parse(localStorage.getItem("userInfo")));
    const [selectedChat,setSelectedChat]=useState();
    const [notification,setNotification]=useState([]);


    const getNotification=(userId)=>{
        try{
            GetNotification(user).then(data=>{
                var notificationArray = [] ;
                data.notifications.forEach((element)=>{
                    notificationArray.push(element.message);
                })
                setNotification(notificationArray);
            })
        }
        catch(err){
            console.log(err);
        }
       };
   const removeNotification=(user,chatId)=>{
    // console.log(user);
    try{
        RemoveNotification(user,chatId).then(data=>{
            var notificationArray = [];
            data.notifications.forEach((element)=>{
                notificationArray.push(element.message);
            })
            setNotification(notificationArray)
        })      
    }
    catch(err){
        console.log(err);
    }
   };
   
   const sendNotification=(response)=>{
     try{
      SendNotification(user, response)
     }
     catch(err){
        console.log(err);
     }
   }

   
   
   return (
    <ChatContext.Provider
    value={{
        user,setUser,
        selectedChat,setSelectedChat,
        chats,setChats,
        error,setError,
        notification,setNotification,
        removeNotification,
        sendNotification,
    }}
    >
      {children}
    </ChatContext.Provider>
   );
};
export const ChatState=()=>{
    return useContext(ChatContext);
}
export default ChatProvider