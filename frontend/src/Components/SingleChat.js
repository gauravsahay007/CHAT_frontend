import {  ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { getOtherUser, getOtherUsers } from "../config/ChatLogics";
import { ChatState } from "../Context/chatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { API } from "../API";
import { color } from "framer-motion";
const ENDPOINT = API;
var socket, selectedChatCompare, lastRoom;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    sendNotification,
    removeNotification,
  } = ChatState();

  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    renderSettings: {
      preserveAspectRatio: "xMidYMid meet",
    },
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    if (selectedChat) {
      socket.emit("leave room", lastRoom);
      lastRoom = selectedChat._id;
    }
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
        removeNotification(newMessageReceived.chat._id);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `${API}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load Messages",
        duration: 5000,
        status: "error",
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async () => {
    socket.emit("stop typing", selectedChat._id);
    if (newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");

        const { data } = await axios.post(
          `${API}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);

        sendNotification(data);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          duration: 5000,
          status: "error",
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={3}
            w={"100%"}
            display="flex"
            bgColor={"#3E103F"}
            color={"white"}
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            border={"2px solid white"}
          >
            <div style={{ display: "inherit" }}>
              {!selectedChat.isGroupChat ? (
                <>
                  <Box mr="10px">
                    <ProfileModal
                      user={getOtherUser(user, selectedChat.users)}
                      size="md"
                    />
                  </Box>
                  <span >{getOtherUser(user, selectedChat.users).name}</span>
                  
                </>
              ) : (
                <>
                  <Box mr="10px">
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                      name={selectedChat.chatName.toUpperCase()}
                    />
                  </Box>
               
                </>
              )}
            </div>
            <IconButton
              display={{ base: "flex", md: "none" }}
              fontSize={"20px"}
              color={"white"}
              _hover={{ color:"black", bgColor:"white", border:"1px solid black" }}
              backgroundColor={"#3E103F"}
              borderRadius="100%"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
          </Text>

          <Box
            display={"flex"}
            flexDir="column"
            justifyContent={"flex-end"}
            p={3}
            style={{  backgroundImage: "url(" + "https://images.pexels.com/photos/6039245/pexels-photo-6039245.jpeg?auto=compress&cs=tinysrgb&h=850" + ")" }}
            
            bg="#E8E8E8"
            w={"100%"}
            h={"100%"}
            borderRadius="sm"
            border={"2px solid white"}
            overflowY={"hidden"}
          >
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {isTyping ? (
              <>
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              </>
            ) : (
              <></>
            )}

            <FormControl isRequired mt={3} display="flex">
              <Input
                variant="filled"
                bgColor="white"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
                color={"white"}
              
                
              />
              <Button
                rightIcon={<SendIcon style={{ fill: "black" }} />}
                backgroundColor="white"
                color="white"
                borderRadius={"100%"}
                pt={"10px"}
                paddingBottom={"10px"}
              pl={"4px"}
              pr={"6px"}
                ml={2}
                onClick={sendMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          style={{  backgroundImage: "url(" + "https://i.ibb.co/FXQQQDB/dool222.jpg" + ")" }}
          h="100%"
          w="100%"
        >
         
        </Box>
      )}
    </>
  );
};

export default SingleChat;
