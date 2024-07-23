import { Message, UserData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React from "react";

interface ChatProps {
  
  selectedUser: UserData;
  isMobile: boolean;
  session:any;
  socket:any
}

export function Chat({ selectedUser, isMobile,session,socket }: ChatProps) {
  const [messages, setMessages] = React.useState<Message[]>(
      []
  );
  console.log("messages:", messages);

  const addMessage = (newMessage: Message) => {
    setMessages((prevMessages) => {
      // Check if the message already exists to prevent duplication
      if (!prevMessages.some(msg => msg.id === newMessage.id)) {
        return [...prevMessages, newMessage];
      }
      return prevMessages;
    });
  };

  React.useEffect(() => {
    socket.on("receive_msg", (data: Message) => {
      addMessage(data);
    });

    return () => {
      socket.off("receive_msg");
    };
  }, [socket]);

  const sendMessage = (newMessage: Message) => {
    // setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} />

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