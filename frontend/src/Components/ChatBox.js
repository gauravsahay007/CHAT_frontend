import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/chatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir={"column"}
     
      marginLeft={"auto"}
      marginRight={"auto"}
      border={"5px solid black"}
      color="black"
      w={{ base: "100%", md: "68%" }}
      borderRadius="sm"
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;