import React, { useState, useEffect } from 'react';
import { ChatState } from '../main/chatProvider';
import ProfileModal from './Modals/profile';
import UpdateGroupChat from './Modals/UpdateGroupChat';
import { API } from '../backend';
import { FetchMessages, RemoveNotification, SendMessage } from './Helper';
import {
  IconButton,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Stack,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ScrollableChats from './ScrollableChats';
import SendIcon from '@mui/icons-material/Send';
import io from 'socket.io-client';
import { useRef } from 'react';

let socket, selectedChatCompare, lastRoom;

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification, sendNotification } =
    ChatState();

  useEffect(() => {
    socket = io.connect('https://simplechat-server-production.up.railway.app');

    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => {
      setIsTyping(true);
    });
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await FetchMessages(selectedChat, user);
      setMessages(response);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (err) {
      setLoading(false);
    }
  };

  const removeNotifications = async (chatId, user) => {
    try {
      const data = await RemoveNotification(chatId, user);
      const notificationArray = data.notifications.map((element) => element.message);
      setNotification(notificationArray);
    } catch (err) {
      console.log(err);
    }
  };

  const sendMessage = async (user, chatId, content) => {
    socket.emit('stop typing', selectedChat._id);
    if (content) {
      try {
        const response = await SendMessage(user, chatId, content);
        socket.emit('new message', response);
        fetchMessages();
        setMessages((prevMessages) => [...prevMessages, response]);
        setFetchAgain(!fetchAgain);
        sendNotification(response);
        setNewMessage('');
      } catch (err) {
        setNewMessage('');
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
    setFetchAgain(!fetchAgain);
    if (selectedChat) {
      socket.emit('leave room', lastRoom);
      lastRoom = selectedChat._id;
    }
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();
    socket.on('message received', (newMessageReceived) => {
      setFetchAgain(!fetchAgain);
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
        removeNotifications(newMessageReceived.chat._id, user);
      }
    });
  }, []);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            sx={{
              display: 'flex',
              m: '4px',
              borderRadius: '5px',
              bgcolor: '#2C3E50',
              color: 'white',
              width: { xs: '95vw', md: '67vw', lg: '67vw' },
            }}
          >
            <Box sx={{ display: 'inherit' }}>
              {!selectedChat.isGroupChat ? (
                <>
                  <Box>
                    <ProfileModal users={selectedChat} />
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', width: 'inherit', alignItems: 'center' }}>
                    <UpdateGroupChat
                      selectedChat={selectedChat}
                      setSelectedChat={setSelectedChat}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    />
                    <Typography>{selectedChat.chatName.toUpperCase()}</Typography>
                  </Box>
                </>
              )}
            </Box>
            <IconButton sx={{ ml: 'auto' }} onClick={() => setSelectedChat('')}>
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>

          <Box sx={{ width: '98%' }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
                <ScrollableChats messages={messages} />
                <Box sx={{ borderTop: '1px solid #ccc', padding: '10px' }}>
                  <Box sx={{ display: 'flex' }}>
                    <TextField
                      fullWidth
                      sx={{ bgcolor: 'white', borderRadius: '5px', marginRight: '10px' }}
                      size="small"
                      id="send-message"
                      label="Message"
                      value={newMessage}
                      onChange={typingHandler}
                    />
                    <IconButton
                      sx={[
                        { bgcolor: '#2C3E50', color: 'white', pl: '14px' },
                        {
                          '&:hover': {
                            color: '#2C3E50',
                            bgcolor: 'white',
                          },
                        },
                      ]}
                      onClick={() => sendMessage(user, selectedChat._id, newMessage)}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            )}

            {isTyping && <div></div>}
          </Box>
        </>
      ) : (
        <Box>
          <Typography sx={{ color: 'white' }}>Click on a user to start chatting</Typography>
        </Box>
      )}
    </>
  );
}
