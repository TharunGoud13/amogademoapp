"use client";

import { userData } from "@/app/data";
import React, { useEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { Sidebar } from "../sidebar";
import { Chat } from "./chat";
import { io } from "socket.io-client";
import { GET_CHAT_GROUP_USERS } from "@/constants/envConfig";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  session: any;
  contactData: any;
  groupsData: any;
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  session,
  contactData, groupsData
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(session?.user);
  const [isMobile, setIsMobile] = useState(false);
  const [groupUsers, setGroupUsers] = useState([]);

  // const socket = io("http://localhost:3001");
  const socket = io("https://chat-service-luje.onrender.com")

  useEffect(() => {
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

  // api for getting chat group users
  useEffect(() => {
    const getChatGroupUsers = async () => {
      try {
        const url = `${GET_CHAT_GROUP_USERS}`;
        const myHeaders = new Headers();
        // myHeaders.append("Authorization", `Bearer ${process.env.GET_ONE_CONTACT_KEY}`);

        const requestOptions: RequestInit = {
          method: "GET",
          // headers: myHeaders,
          redirect: "follow"
        };

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
          throw new Error("Failed to fetch group users");
        }
        const data = await response.json();
        setGroupUsers(data);
      }
      catch (error) {
        console.error("Error fetching group users:", error);
      }
    }
    getChatGroupUsers();

  },[])

  return (
    <Chat
      selectedUser={selectedUser}
      isMobile={isMobile}
      session={session}
      socket={socket}
      contactData={contactData}
      groupsData={groupsData}
      groupUsers={groupUsers}
    />
  );
}