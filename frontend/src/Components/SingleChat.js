import React from 'react'
import { useState, useEffect } from 'react'
import { ChatState } from '../main/chatProvider'
import ProfileModal from './Modals/profile'
import UpdateGroupChat from './Modals/UpdateGroupChat'
import { API } from '../backend'
import { FetchMessages, RemoveNotification, SendMessage } from './Helper'
import { IconButton, Typography, Grid, TextField, Button , Box, Stack} from '@mui/material'
import { getOtherUser } from '../configuration/logic' 
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';
import ScrollableChats from './ScrollableChats'
import SendIcon from '@mui/icons-material/Send';
import io from "socket.io-client"
import { TrySharp } from '@mui/icons-material'
import { GetUser } from './Helper'
import { useRef } from 'react'

var socket, selectedChatCompare, lastRoom;


export default function SingleChat({fetchAgain, setFetchAgain}) {
    const [messages, setMessages]  = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping , setIsTyping ] = useState(false);

   


    const {
        user,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        sendNotification,
        removeNotification
    } = ChatState();

        
    // console.log(socket);
    useEffect(()=>{
        socket = io.connect("http://localhost:8080");
        
        socket.emit("setup",user);
        socket.on("connected",()=>setSocketConnected(true));
        socket.on("typing",()=>{
            setIsTyping(true);
        });
        socket.on("stop typing", ()=> setIsTyping(false));
    },[]); 

    // console.log(notification);

    // fetchMessages responsible for fetching the messages related to selected chat. it asynchronoulsy retrieces messages from a server . It assures that the appropriate messages are loaded for the currently selected chat
    const fetchMessages = () => {
        try{
            FetchMessages(selectedChat,user).then(response=>{
                setMessages(response);
                setLoading(false);
                socket.emit("join chat", selectedChat._id);
            })
        }
        catch(err){
            setLoading(false);
        }
    
    }

    const removeNotifications = (chatId,user) => {
        try{
            RemoveNotification(chatId,user).then(data=>{
                var notificationArray = [];
                data.notifications.forEach((element)=>{
                    notificationArray.push(element.message)
                })

                setNotification(notificationArray);
            })
        }
        catch(err){
            console.log(err);
        }
    }


    const sendMessage = (user,chatId,content) => {
        socket.emit("stop typing", selectedChat._id);
        if(content){
            try{
                SendMessage(user,chatId,content).then((response)=>{
                    // console.log(response);
                    socket.emit("new message", (response));
                    console.log(messages);
                    fetchMessages();
                    setMessages([...messages, response]);
                  
                    setFetchAgain(!fetchAgain);
                    sendNotification(response);
                    setNewMessage("");
                }) 
            }
            catch(err){
                setNewMessage("");
                console.log(err);
            }
        }
    }


    // below code emits leave room when a new chat is selected the code emits this emit informs the server that the user is leaving the previous chat room
    // updating last room to hold the current selectedChat this ensures that the correct chat room is left when a new chat is selected
    // selectedChatCompare is assigned to value of current selectedChat. It used to compare the current selected chat with the new messages recieved in the second useEffect hook this comparison helps to determine is the new message should trigger a notification or update the exisiting messages                                               


    useEffect(()=>{
        fetchMessages();
        setFetchAgain(!fetchAgain);
        if(selectedChat){
            socket.emit("leave room", lastRoom);
            lastRoom = selectedChat._id;
        }

        selectedChatCompare = selectedChat;


    },[selectedChat])
 
    useEffect(()=>{
        socket.on("message received", (newMessageReceived) => {
            fetchMessages();
            setFetchAgain(!fetchAgain);
            // console.log(messages);
            // console.log(newMessageReceived);
            if(
                !selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id
            ){
            if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                  
            }
            } else {
                setMessages([...messages, newMessageReceived]);
                removeNotifications(newMessageReceived.chat._id, user)
            }
        })
    },[])

//    below code keeps track of user typing in the chat input field it emits typign and sto typing events to server to notify other users in the chat room about typing activity 
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if(!socketConnected) return;

        if(!typing){
            // selectedchat._id is sent along with the evneet to identify the chat room where the typing is occuring
            setTyping(true);
            socket.emit("typing",selectedChat._id);
        }

        // to get current timestamp when the user started typing
        let lastTypingTime = new Date().getTime();

        // the timerLength represents the duration after which the typing state will be considered inactive if no further typing occurs
        var timerLength = 3000;


        setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            // it checks current time - lastTypingtime >= timeLength and if user still typing 
            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

// console.log(messages);
//    console.log(selectedChat);


    
  return (
    <>
    {selectedChat? (
     <> 
    
     <Box sx={{display:"flex",m:"4px",
     borderRadius:"5px",bgcolor:"#2C3E50",color:"white", width:{xs:"95vw", md:"67vw", lg:"67vw"}}} >
        <Box sx={{ display:"inherit"}} >
            {!selectedChat.isGroupChat ? (
                <>
                <Box>
                    <ProfileModal
                    users={selectedChat}
                    />
                </Box>

                </>
            ):(
                <>
                
                <Box sx={{display:"flex",width:"inherit", alignItems: 'center'}} >
                    <UpdateGroupChat
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                    />
                    <Typography >{selectedChat.chatName.toUpperCase()}</Typography>
                   
       
                    </Box>
                    </>
            )}
        </Box>
        <IconButton sx={{ml:"auto"}} onClick={()=>{
            setSelectedChat("");
        }} >
          
            <CloseIcon sx={{color:"white"}}/>
        </IconButton>

       
     </Box>

     <Box sx={{width:"98%"}} >
        {loading? (
            <CircularProgress/>
        ):(
            <Box sx={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
            <ScrollableChats messages={messages}/>
          
            <Box sx={{ borderTop: "1px solid #ccc",  padding: "10px" }}>
              <Box sx={{ display: "flex" }}>
                <TextField
                  fullWidth
                  sx={{ bgcolor: "white", borderRadius: "5px", marginRight: "10px" }}
                  size="small"
                  id="send-message"
                  label="Message"
                  value={newMessage}
                  onChange={typingHandler}
                />
          
                <IconButton sx={[{bgcolor:"#2C3E50",color:"white",pl:"14px"},{
                    "&:hover":{
                        color:"#2C3E50",
                        bgcolor:"white"
                    }
                }]} onClick={() => sendMessage(user, selectedChat._id, newMessage)}>
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}

        {isTyping?(<>
        <div>
            </div></>):(<>
            </>)}
     </Box>
     </>
    ):(<Box>
        <Typography sx={{color:"white"}}>
            Click on a user to start chatting
        </Typography>
    </Box>)}
    </>
  )
}
