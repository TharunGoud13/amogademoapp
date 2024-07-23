import React, { useEffect, useState, useCallback } from "react";
import { Message, UserData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";

interface ChatProps {
  selectedUser: UserData;
  isMobile: boolean;
  session: any;
  socket: any;
}

export function Chat({ selectedUser, isMobile, session, socket }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleNewMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receive_msg", handleNewMessage);

      return () => {
        socket.off("receive_msg", handleNewMessage);
      };
    }
  }, [socket, handleNewMessage]);

  const sendMessage = useCallback((newMessage: Message) => {
    if (socket && socket.connected) {
      socket.emit("send_msg", newMessage);
      handleNewMessage(newMessage)
    } else {
      console.error("Socket is not connected");
    }
  }, [socket,handleNewMessage]);

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />
      <ChatList
        messages={messages}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        isMobile={isMobile}  
        socket={socket}
        session={session}
      />
    </div>
  );
}