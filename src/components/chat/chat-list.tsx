import { Message, UserData } from "@/app/data";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from 'js-cookie'

interface ChatListProps {
  messages?: any;
  selectedUser: UserData;
  isMobile: boolean;
  session:any;
  socket: any;
  setMessages:any;
  addMessage:any;
  contactData:any
}

export function ChatList({
  messages,
  selectedUser,
  contactData,
  setMessages,
  isMobile,
  session,
  socket,addMessage
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // getting current logged in user id to align messages based on login user and message receiving person
  const cookiesdata = Cookies.get('currentUser')
  const userData = cookiesdata ? JSON.parse(cookiesdata) : null
  const currentUserId = userData?.user_catalog_id
  
  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message:any, index:any) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.sender_id == currentUserId ? "items-end" : "items-start"
              )}
            > 
              <div className="flex gap-3 items-center">
                
                {message.sender_id != currentUserId && (  
                  <Avatar className="flex justify-center items-center">
                  <AvatarFallback className="flex-1">
                      {contactData[0]?.user_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
                <span className=" bg-accent p-3 rounded-md max-w-xs">
                  {message.chat_message}
                </span>
                {message.sender_id == currentUserId && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                      />
                      <AvatarFallback className="flex-1">
                        {message.sender_display_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>   
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar contactData={contactData} addMessage={addMessage} setMessages={setMessages} socket={socket} isMobile={isMobile} session={session}/>
    </div>
  );
}