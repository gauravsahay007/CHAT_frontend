import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useToast,
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Avatar,
  Spinner,
} from "@chakra-ui/react";
import { Search, Notifications, ExpandMore } from "@mui/icons-material";
import { ChatState } from "../../Context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getOtherUser } from "../../config/ChatLogics";
import NotificationBadge, { Effect } from "react-notification-badge";
import { API } from "../../API";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    removeNotification,
  } = ChatState();

  const navigate = useNavigate();

  const LogoutHandler = () => {
    setNotification([]);
    localStorage.removeItem("userInfo");
    setSelectedChat();
    navigate("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Search Bar Empty",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });

      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${API}/api/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`${API}/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      setLoadingChat(false);
      toast({
        title: "Error fetchind the Chat",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        bg="#3E103F"
        w={"100%"}
        
        borderRadius={"0px 0px sm sm"}
        // borderWidth="5px"
      >
        
  <Menu>
            <MenuButton
              p={1}
              as={Button}
              color={"white"}
              _hover={{bgColor:"white", color:"black"}}
              rightIcon={<ExpandMore />}
              backgroundColor="#3E103F"
            >
              <Avatar
                size="sm"
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user} size="sm">
                <MenuItem style={{fontFamily:"Pacifico", fontSize:"20px"}}  color={"black"} >My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem style={{fontFamily:"Pacifico", fontSize:"20px"}} color={"black"}  onClick={LogoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
     

        <div style={{ display: "flex", alignContent: "center" }}>
          <Menu>
            <MenuButton mt={"9px"} color="white">
              <NotificationBadge
                colorScheme="white"
                count={notification.length}
                effect={Effect.SCALE}
              />
              <Notifications />
            </MenuButton>
            <MenuList pl={5} pr={5}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <>
                  <MenuItem
                    key={notif._id}
                    onClick={() => {
                      setSelectedChat(notif.chat);
                      removeNotification(notif.chat._id);
                    }}
                    display="contents"
                  >
                    <Box color={"#3E103F"} fontWeight={"semibold"}>
                      {notif.chat.isGroupChat
                        ? `New Message in ${notif.chat.chatName}`
                        : `New Message from ${
                            getOtherUser(user, notif.chat.users).name
                          }`}
                    </Box>
                    <div>{notif.content}</div>
                  </MenuItem>
                  <MenuDivider />
                </>
              ))}
            </MenuList>
            
            <Tooltip label="Search Users" hasArrow placement="bottom-end">
          <Button
            color="white"
            _hover={{color:"white"}}
            variant={"ghost"}
            onClick={onOpen}
            bgColor="#3E103F"
            mt={"4px"}
            ml={"9px"}
          >
            <Search />
            {/* <Text display={{ base: "none", md: "flex" }} px="4" color="white">
              Search User
            </Text> */}
          </Button>
        </Tooltip>
          </Menu>
        
        </div>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
         style={{fontFamily:"Pacifico", fontSize:"20px"}} 
        >
          <ModalHeader borderBottomWidth="1px" bgColor="#3E103F" color="white">
            Search Users
          </ModalHeader>

          <ModalBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                border="1px solid #3E103F"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                bgColor="#3E103F"
                color="white"
                _hover={{ color: 'black', bgColor: '#CAD5E2' }}
                onClick={handleSearch}
              >
                <Search color="white"/>
              </Button>
            </Box>
            {loading ? (
              <Spinner />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </ModalBody>

        
        </ModalContent>
      </Modal>
    </>
  );
};

export default SideDrawer;
