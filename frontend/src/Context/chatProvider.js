import { useToast} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { getOtherUsers } from "../config/ChatLogics";
import { API } from "../API";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);

  const navigate = useNavigate();

  const toast = useToast();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  const getNotifications = async () => {
    if (!user) {
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API}/api/user/getnotifications/${user._id}`,
        config
      );

      var notificationArray = [];
      data.notifications.forEach((element) => {
        notificationArray.push(element.message);
      });
      setNotification(notificationArray);
    } catch (error) {
      toast({
        title: "Error fetching the Notifications",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };

  const removeNotification = async (chatId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `${API}/api/user/removenotification`,
        {
          userId: user._id,
          chatId: chatId,
        },
        config
      );

      console.log(data);

      var notificationArray = [];
      data.notifications.forEach((element) => {
        notificationArray.push(element.message);
      });
      setNotification(notificationArray);
    } catch (error) {
      toast({
        title: "Error deleting the Notification",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendNotification = async (data) => {
    const receivers = getOtherUsers(user, selectedChat.users);

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    for (const receiver of receivers) {
      await axios.post(
        `${API}/api/user/storenotification`,
        {
          userId: receiver._id,
          messageId: data._id,
          chatId: data.chat._id,
        },
        config
      );
    }
  };

  useEffect(() => {
    getNotifications();
  }, [user]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        removeNotification,
        sendNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
