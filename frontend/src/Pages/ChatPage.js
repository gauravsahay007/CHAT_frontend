import React, { useState } from "react";
import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/Mychats";
import ChatBox from "../components/ChatBox";
import Header from "../components/miscellaneous/Header";
const Chatpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();

  return (
    <div style={{ width: "100%" }}>
      {user && <Header />}
      <Box
        display={"flex"}
        
       gap={"0"}
        w={"100%"}
        h={"91.5vh"}
        p={"3px"}
        color={"black"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
