import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
// react things
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// modals
import ProfileModal from "./ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from "../../UserAvatar/UserListItem";
// redux sets
import { setChats, setNotifications, setSelectedChat } from "../../states";
import { getSender } from "../../config/ChatLogics";
// notification things
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";

const SideDrawer = () => {
  // states
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  // redux states
  const user = useSelector((state) => state.user);
  const notifications = useSelector((state) => state.notifications);
  const chats = useSelector((state) => state.chats);
  // others
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(notifications,"sidedrawerdeki")

  // functions
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    dispatch(setChats());
    dispatch(setSelectedChat());

    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Nese yazda ",

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
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Axtarammadiq ",
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setLoadingChat(false);
      dispatch(setSelectedChat(data));
      onClose();
    } catch (error) {
      toast({
        title: "Chati goturende nese sehv oldu ",
        description: error.message,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  // return
  return (
    <>
      <Box
        display={"flex"}
        justifyContent="space-between"
        alignItems={"center"}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Axtar adam mesajlas" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Adam Axtar
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work-sans">
          Mini-Mini
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notifications.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2} pr={2}>
              {!notifications.length
                ? "Teze mesaj yoxdu"
                : notifications.map((notification) => (
                    <MenuItem
                      onClick={() => {
                        dispatch(setSelectedChat(notification.chat));
                        dispatch(
                          setNotifications({remove:
                            notifications.filter((n) => n !== notification)}
                          )
                        );
                      }}
                    >
                      {notification.chat.isGroupChat
                        ? `Teze Mesaj var burda ${notification.chat.chatName}`
                        : `Teze mesaj gonderiba ${getSender(
                            user,
                            notification.chat.users
                          )}`}
                    </MenuItem>
                  ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor={"pointer"}
                name={user.email}
                src={user.picture}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />\
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Adam Axtar</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb="2">
              <Input
                placeholder="Axtar adnan ya da emailnan"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}>Getdun</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
