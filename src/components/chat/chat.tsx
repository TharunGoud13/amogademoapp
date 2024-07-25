import { Message, UserData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect, useState, useCallback } from "react";

interface ChatProps {
  selectedUser: UserData;
  isMobile: boolean;
  session: any;
  socket: any;
  contactData: any;
  contactUser:any
}

export function Chat({ selectedUser, isMobile, session, socket,contactData,contactUser }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  console.log("messages----",messages)

  const addMessage = useCallback((newMessage: Message) => {
    setMessages((prevMessages) => {
      if (!prevMessages.some(msg => msg.id === newMessage.id)) {
        return [...prevMessages, newMessage];
      }
      return prevMessages;
    });
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: Message) => {
      addMessage(data);
    };

    const handleLoadMessages = (loadedMessages: Message[]) => {
      setMessages(loadedMessages);
    };

    socket.on("receive_msg", handleReceiveMessage);
    socket.on("load_messages", handleLoadMessages);

    // Join room when component mounts or selectedUser changes
    socket.emit("join_room", { userId: selectedUser.id, contactId: contactUser.id });

    return () => {
      socket.off("receive_msg", handleReceiveMessage);
      socket.off("load_messages", handleLoadMessages);
    };
  }, [socket, selectedUser.id, addMessage,contactUser.id]);

  const sendMessage = useCallback((newMessage: Omit<Message, 'id' | 'createdAt'>) => {
    if (socket) {
      socket.emit("send_msg", {
        ...newMessage,
        senderId: selectedUser.id,
        receiverId: contactUser.id,
      });
    }
  }, [socket, selectedUser.id,contactUser.id]);

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} contactData={contactData} />

      <ChatList
        messages={messages}
        selectedUser={selectedUser}
        sendMessage={sendMessage}
        addMessage={addMessage}
        setMessages={setMessages}
        isMobile={isMobile}
        session={session}
        socket={socket}
      />
    </div>
  );
}