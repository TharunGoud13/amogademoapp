import { Message, UserData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect, useState, useCallback } from "react";
import { GET_CHAT_MESSAGES, GET_FILE_MESSAGES } from "@/constants/envConfig";

interface ChatProps {
  selectedUser: UserData;
  isMobile: boolean;
  session: any;
  socket: any;
  contactData: any;
  groupsData:any;
  userStatus:any;
  typingUsers:any;
}

export  function Chat({ selectedUser, isMobile, session,userStatus,socket,contactData,groupsData,typingUsers }: ChatProps) {
  const [messages, setMessages] = useState<any[]>([]);


  const addMessage = useCallback((newMessage: any) => {
    setMessages((prevMessages) => {
      if (!prevMessages.some(msg => msg.id === newMessage.id)) {
        return [...prevMessages, newMessage].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      }
      return prevMessages;
    });
  }, []);

  //api call for getting messages and socket for receiving messages

  const fetchMessagesAndFiles = useCallback(async () => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`);
      
      const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      let chatUrl = `${GET_CHAT_MESSAGES}`;
      let fileUrl = `${GET_FILE_MESSAGES}`;

      if (contactData && contactData.length > 0) {
        const queryParam = `?receiver_user_id=eq.${contactData[0].user_catalog_id}`;
        chatUrl += queryParam;
        fileUrl += queryParam;
      } else {
        const queryParam = `?receiver_group_id=eq.${groupsData && groupsData[0] && groupsData[0].chat_group_id}`;
        chatUrl += queryParam;
        fileUrl += queryParam;
      }

      const [chatResponse, fileResponse] = await Promise.all([
        fetch(chatUrl, requestOptions),
        fetch(fileUrl, requestOptions)
      ]);

      const chatData = await chatResponse.json();
      const fileData = await fileResponse.json();

      // Combine chat messages and file messages
      const combinedMessages = [...chatData, ...fileData].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      setMessages(combinedMessages);
    } catch (error) {
      console.log("error fetching messages and files:", error);
    }
  }, [contactData, groupsData]);

  useEffect(() => {
    // Join the room when the component mounts or when the selected user changes
    fetchMessagesAndFiles()
    if (selectedUser) {
      socket.emit('join_room', selectedUser.id);
    }

    // Listen for incoming messages
    socket.on("receive_msg", (data: Message) => {
      addMessage(data);
    });

    return () => {
      // Leave the room when the component unmounts or when the selected user changes
      if (selectedUser) {
        socket.emit('leave_room', selectedUser.id);
      }
      socket.off("receive_msg");
    };
  }, [socket, selectedUser, addMessage,fetchMessagesAndFiles]);
  
  return (
    <div className="flex flex-col justify-between w-full h-[75vh] !overflow-hidden">
      <ChatTopbar selectedUser={selectedUser} contactData={contactData} groupsData={groupsData} 
      userStatus={userStatus} typingUsers={typingUsers}
      
        />
      <ChatList
        messages={messages}
        selectedUser={selectedUser}
        addMessage={addMessage}
        setMessages={setMessages}
        isMobile={isMobile}
        session={session}
        socket={socket}
        contactData={contactData}
        groupsData={groupsData}
      />
    </div>
  );
}