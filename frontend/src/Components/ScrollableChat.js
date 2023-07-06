import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";

import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/chatProvider";
import { API } from "../API";
const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = ChatState();

  return (
    <>
      <ScrollableFeed style={{ backgroundImage: "url(pxfuel.jpg)", backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
        
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
              {selectedChat.isGroupChat ? (
                (isSameSender(messages, m, i, user._id) ||
                  isLastMessage(messages, i, user._id)) && (
                  <Tooltip
                    label={m.sender.name}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor={"pointer"}
                      name={m.sender.name}
                      src={m.sender.pic}
                    />
                  </Tooltip>
                )
              ) : (
                <></>
              )}
              <span
                style={{
                  backgroundColor: `${
                    m.sender._id === user._id ? "#944F9A":"#3E103F"
                  }`,
                  color:`${m.sender._id === user._id ? "white" : "white"}`,

                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: selectedChat.isGroupChat
                    ? isSameSenderMargin(messages, m, i, user._id)
                    : m.sender._id === user._id
                    ? "auto"
                    : "0px",
                  marginTop: isSameUser(messages, m, i) ? 3 : 10,
                }}
              >
                {m.content}
              </span>
            </div>
          ))}
      </ScrollableFeed>
    </>
  );
};

export default ScrollableChat;
