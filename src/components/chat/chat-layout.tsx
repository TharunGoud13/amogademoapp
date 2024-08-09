"use client";
import React, { FC, useEffect, useState } from "react";
import { Chat } from "./chat";
import { io } from "socket.io-client";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  session: any;
  contactData: any;
  groupsData: any;
}

const ChatLayout:FC<any> = ({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  session,
  contactData, groupsData,getChatGroupUsers,getChatGroupUsersResponse
}) => {
  const [selectedUser, setSelectedUser] = React.useState(session?.user);
  const [isMobile, setIsMobile] = useState(false);

  // const socket = io("http://localhost:3001");
  const socket = io("https://chat-service-luje.onrender.com")

  useEffect(() => {
    // emit - send event from client to server
    socket.emit("join_room", "user");
    return () => {
      socket.disconnect();
    };
  }, [socket])


  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenWidth();
    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <Chat
      selectedUser={selectedUser}
      isMobile={isMobile}
      session={session}
      socket={socket}
      contactData={contactData}
      groupsData={groupsData}
    />
  );
}

export default ChatLayout;