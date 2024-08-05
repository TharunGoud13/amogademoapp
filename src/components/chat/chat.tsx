import { Message, UserData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React, { useEffect, useState, useCallback } from "react";
import { GET_CHAT_MESSAGES } from "@/constants/envConfig";

interface ChatProps {
  selectedUser: UserData;
  isMobile: boolean;
  session: any;
  socket: any;
  contactData: any;
  groupsData:any;
  groupUsers:any
}

export  function Chat({ selectedUser, isMobile, session, socket,contactData,groupsData,groupUsers }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);

  // console.log("messages----",messages)

  const addMessage = useCallback((newMessage: Message) => {
    // each message has some id so here we are checking if previous message has same id or not.
    // if id are different then we are adding new message to the array
    setMessages((prevMessages) => {
      if (!prevMessages.some(msg => msg.id === newMessage.id)) {
        return [...prevMessages, newMessage];
      }
      return prevMessages;
    });
  }, []);

  //api call for getting messages and socket for receiving messages

  const fetchMessages = useCallback(async() => {
    try{
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${process.env.GET_ONE_CONTACT_KEY}`);
    
      const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };
    
      const response = await fetch(`${GET_CHAT_MESSAGES}${contactData[0].user_catalog_id}`, requestOptions);
      const data = await response.json();
      setMessages(data)
      return data;
    }
    catch(error){
      console.log("error fetching messages----", error)
    }
  },[contactData])

  useEffect(() => {
    // Join the room when the component mounts or when the selected user changes
    fetchMessages()
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
  }, [socket, selectedUser, addMessage,fetchMessages]);
  
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar selectedUser={selectedUser} contactData={contactData} groupsData={groupsData} 
        groupUsers={groupUsers}
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
      />
    </div>
  );
}