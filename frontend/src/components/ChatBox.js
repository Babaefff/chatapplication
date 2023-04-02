import { Box, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleChat from "./SingleChat";

const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const selectedChat = useSelector((state) => state.selectedChat);

  // useEffect(() => {

  //   // eslint-disable-next-line
  // }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir={"column"}
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth={"1px"}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
