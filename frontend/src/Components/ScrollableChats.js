import { Avatar, Box, Paper, Stack, Tooltip } from '@mui/material';
import React from 'react'
import { useRef,useEffect } from 'react';
import { isSameSender, isSameSenderMargin, isSameUser } from '../configuration/logic';
import { ChatState } from '../main/chatProvider';
import { isLastMessage } from '../configuration/logic';
import ScrollableFeed from "react-scrollable-feed"
import "../styles.css"
import {Scrollbar} from "react-scrollbars-custom"
export default function ScrollableChats({messages}) {

    const {user , selectedChat} = ChatState();
//     console.log(selectedChat);

//     console.log(messages[0].sender._id);
// console.log(user.user._id);
const chatRef = useRef(null);

useEffect(() => {
  
  if (chatRef.current) {
    // Scroll to the bottom of the chat component
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }
}, [messages]);

return (
  <Paper
    style={{
      maxHeight: '84%',
      overflow: 'auto',
      width: '100%',
      height: '95vh',
      paddingLeft:"4px",
      paddingRight:"4px",
      
    }}
    ref={chatRef}
  >
    {messages &&
      messages.map((m, i) => (
        <div style={{ display: 'flex' }} key={m._id}>
          {/* Render Avatar component here */}
          <span
            style={{
              backgroundColor: `${
                m.sender._id === user.user._id ? '#BEE3F8' : '#B9F5D0'
              }`,
              borderRadius: '20px',
              padding: '5px 15px',
              maxWidth: '75%',
              marginLeft: selectedChat.isGroupChat
                ? isSameSenderMargin(messages, m, i, user.user._id)
                : m.sender._id === user.user._id
                ? 'auto'
                : '0px',
              marginTop: isSameUser(messages, m, i) ? 3 : 10,
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
  </Paper>
);
}