import React from 'react'
import { useState,useEffect } from 'react'
import CreateGroupChat from './Modals/CreateGroupChat'
import {Avatar} from '@mui/material'
import { ChatState } from '../main/chatProvider'
import { FetchChats } from './Helper';
import { getOtherUser } from '../configuration/logic';
import ChatLoading from './chatloading'
// --------------------------------------------
// MUI
import { Box , Stack, Typography} from '@mui/material'

// --------------------------------------------

export default function Mychats({fetchAgain,setFetchAgain}) {
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    removeNotification,
  } = ChatState();

  const [loggedUser, setLoggedUser] = useState(user);
const [loading, setLoading] = useState(false);
 const fetchChats = () =>{
  try{
  FetchChats(user).then((response)=>{
    // console.log(response);
    setChats(response);
    
  })
}catch(err){
  console.log(err);
 }}
   
 

  useEffect(()=>{
  
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats();
    // console.log("fetched again MyChats.js");
  },[fetchAgain]);

  const selectChat = (chat) =>{
    
    setSelectedChat(chat);
    removeNotification(user,chat._id);
    setFetchAgain(!fetchAgain);
  }


  return (
    <>
      <Box
        sx={{
          display: { md: selectedChat ? 'flex' : 'flex', xs: selectedChat ? 'none' : 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'white',
          height: '94vh',
          mt: '10px',
          m: { xs: 'auto', md: '0px', lg: '0px' },
          borderRadius: '4px',
          mr: { xs: 'auto', md: 'auto', lg: 'auto' },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography sx={{ color: '#32465A', mt: '5px', ml: '10px' }}>MY CHATS</Typography>
          <CreateGroupChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>

        <Box
          sx={{
            bgcolor: '#F0EEED',
            p: '10px',
            borderRadius: '4px',
            width: '100vw',
            mt: '10px',
            height: '90%',
            mr: { xs: '0px', md: 'auto' },
            ml: { xs: '0px', md: '5px', lg: '5px' },
            width: { xs: '90vw', md: '30vw', lg: '30vw' },
            overflow: 'auto',
          }}
        >
          {chats ? (
            <Stack sx={{ width: '100%', cursor: 'pointer' }}>
              {chats.map((chat) => (
                <Box
                  onClick={() => selectChat(chat)}
                  sx={{
                    bgcolor: '#2C3E50',
                    color: 'white',
                    mb: '2px',
                    width: '100%',
                    height: '3rem',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 10px',
                  }}
                  key={chat._id}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: '30px', height: '30px', mt: '3px', ml: '3px' }} cursor="pointer" src={user.pic} />
                    <Typography sx={{ ml: '5px' }}>
                      {!chat.isGroupChat ? chat.chatName : chat.chatName}
                    </Typography>
                  </Box>

                  {chat.latestMessage && (
                    <Typography sx={{ color: 'white', ml: 'auto' }}>
                      {!chat.isGroupChat
                        ? chat.latestMessage.content
                        : chat.latestMessage.sender._id === loggedUser.user._id
                        ? `You: ${chat.latestMessage.content}`
                        : `${chat.latestMessage.sender.name}: ${chat.latestMessage.content}`}
                    </Typography>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
}