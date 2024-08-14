"use client";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Chat } from "./chat";
import { io } from "socket.io-client";

//session - user session details
// contactData - data related to contacts 
// groupsData - data related to groups

const ChatLayout: FC<any> = ({
  session,
  contactData, groupsData
}) => {
  const [selectedUser, setSelectedUser] = React.useState(session?.user);
  const [isMobile, setIsMobile] = useState(false);
  const [userStatus, setUserStatus] = useState<any>([])
  const [typingUsers, setTypingUsers] = useState<any>({});



  const socket: any = useMemo(() => {
    const env = process.env.NODE_ENV;
    return env === "development"
      ? io("http://localhost:3001")
      : io("https://chat-service-luje.onrender.com");
  }, []);

  console.log("socket----",socket)

  const handleConnect = useCallback(() => {
    console.log("Socket connected");
    if (session?.user?.id) {
      socket.emit("join_room", "user");
      socket.emit("user_online", session?.user?.id);
    }
  }, [session?.user?.id, socket]);

  const handleUserStatusChange = useCallback((data: any) => {
    console.log("Event data:", data);
    if (data && typeof data === 'object') {
      const { userId, status } = data;
      console.log(`User ${userId} is ${status} now`);
      setUserStatus((prevStatus: any) => {
        const existingStatusIndex = prevStatus.findIndex((item: any) => item.id === userId);
        if (existingStatusIndex !== -1) {
          if (prevStatus[existingStatusIndex].status === status) {
            return prevStatus; // No change, return the same array
          }
          // Update existing status
          const newStatus = [...prevStatus];
          newStatus[existingStatusIndex] = { id: userId, status };
          return newStatus;
        }
        // Add new status
        return [...prevStatus, { id: userId, status }];
      });
    } else {
      console.log("Unexpected data format:", data);
    }
  }, []);

  

  const handleTyping = useCallback((data: { userId: string }) => {
    setTypingUsers((prev:any) => ({ ...prev, [data.userId]: true }));
  },[])
  
  const handleStopTyping = useCallback((data: { userId: string }) => {
    setTypingUsers((prev:any) => ({ ...prev, [data.userId]: false }));
  }, []);

  const handleConnectError = useCallback((error: Error) => {
    console.error("Socket connection error:", error);
  }, []);

  useEffect(() => {
    socket.on("connect", handleConnect);
    socket.on("user_status_changed", handleUserStatusChange);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("connect_error", handleConnectError);

    if (socket.connected && session?.user?.id) {
      socket.emit("join_room", "user");
      socket.emit("user_online", session.user.id);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("user_status_changed", handleUserStatusChange);
      socket.on("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("connect_error", handleConnectError);
    };
  }, [socket, session?.user?.id, handleConnect, handleUserStatusChange, handleConnectError, handleTyping,handleStopTyping]);




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
      userStatus={userStatus}
      typingUsers={typingUsers}
    />
  );
}

export default ChatLayout;