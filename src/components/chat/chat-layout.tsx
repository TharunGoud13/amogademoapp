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

interface ChatLayoutProps {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  session: any;
  contactData:any
}

export function ChatLayout({
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize,
  session,
  contactData
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedUser, setSelectedUser] = React.useState(session?.user);
  const [isMobile, setIsMobile] = useState(false);
  const contactUser = contactData

  let socket:any;
  // socket = io("https://chat-service-luje.onrender.com");
  // socket = io("https://chat-service-luje.onrender.com");
  socket = io("http://localhost:3001");

  useEffect(() => {
    socket.emit("join_room", "user");
  },[socket])


  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
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
          contactUser={contactUser}
        />   
  );
}