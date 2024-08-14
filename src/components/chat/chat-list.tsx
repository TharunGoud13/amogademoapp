import { Message, UserData } from "@/app/data";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from 'js-cookie'
import { Reply, X, Smile, Paperclip } from "lucide-react";
import ReactionPopover from "../reactionpopover";
import { CREATE_CHAT_MESSAGE } from "@/constants/envConfig";
import { FaFile } from "react-icons/fa6";


interface ChatListProps {
  messages?: any;
  selectedUser: UserData;
  isMobile: boolean;
  session: any;
  socket: any;
  setMessages: any;
  addMessage: any;
  contactData: any;
  groupsData: any
}

export function ChatList({
  messages,
  selectedUser,
  contactData,
  setMessages,
  isMobile,
  session,
  socket, addMessage, groupsData
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<any>(null);
  const [showReactions, setShowReactions] = useState<{ [key: string]: boolean }>({});
  const [files, setFiles] = useState<any>([])

  // getting current logged in user id to align messages based on login user and message receiving person
  const cookiesdata = Cookies.get('currentUser')
  const userData = cookiesdata ? JSON.parse(cookiesdata) : null
  const currentUserId = userData?.user_catalog_id

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      // scroll to bottom when new messages arrive
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // handleReply and handleCancelReply are functions for setting reply message to state and cancelling reply
  const handleReply = (message: any) => {
    setReplyTo(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };


  const messageMap = React.useMemo(() => {
    const map = new Map();
    messages.forEach((message: any) => {
      map.set(message.chat_message_id, message);
    });
    return map;
  }, [messages]);

  const toggleReactions = (messageId: string) => {
    { console.log() }
    setShowReactions(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const handleReaction = (messageId: any, emoji: any) => {
    console.log("Reaction added", messageId, emoji);
  }

  const handleFileUpload = (fileInfo: { id: string, name: string, url: string }) => {
    setFiles((prevFiles: any) => [...prevFiles, fileInfo]);
  };



  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message: any, index: any) => (
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
              {message.replied_to_message_id && (
                <div className="text-sm opacity-70 pb-2 border-b border-opacity-20 mb-2">
                  <span className="font-semibold">Replying to:</span> {messageMap.get(message.replied_to_message_id)?.chat_message || "Deleted message"}
                </div>
              )}
              <div className="flex gap-3 items-center">

                {message.sender_id != currentUserId && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarFallback className="flex-1">
                      {contactData && contactData[0]?.user_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                    <AvatarImage
                      src={message.avatar}
                      alt={message.name}
                      width={6}
                      height={6}
                    />
                  </Avatar>
                )}
                {showReactions[message.chat_message_id] && (
                  <div className={cn(
                    "absolute z-10",
                    message.sender_id == currentUserId ? "ml-[-5%] mt-[-10%]" : "mt-[-10%]"
                  )}>
                    <ReactionPopover
                      id={message.chat_message_id}
                      isCurrentUser={message.sender_id == currentUserId}
                      onReact={handleReaction}
                    />
                  </div>
                )}
                <button onClick={() => toggleReactions(message.chat_message_id)}>
                  <Smile size={20} className="text-gray-400 hover:text-gray-700" />
                </button>

                <span className="bg-accent p-3 rounded-md max-w-xs relative">
                  {/* {console.log("message----",message)} */}
                  {message?.document_file ?
                    <div className="flex">
                      <FaFile className="text-lg"/>
                      
                      {message.document_type.startsWith('image/') ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`data:${message.document_type};base64,${message.document_file}`} alt={message.document_name} />
                      ) : (
                        <a href={`data:${message.document_type};base64,${message.document_file}`} download={message.document_name}> {message.document_name}</a>
                      )}
                      <p>{message?.document_type}</p>
                    </div> :
                    message?.chat_message}
                  {message.reactions && Array.isArray(message.reactions) && message.reactions.length > 0 && (
                    <div className="absolute bottom-0 left-0 transform translate-y-1/2 flex -space-x-1 flex-wrap">
                      {message.reactions.map((reaction: { emoji: string, user_id: string }, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center justify-center w-6 h-6 text-xs bg-white border-2 border-accent rounded-full shadow-sm hover:scale-110 transition-transform duration-200 ease-in-out"
                          title={`Reacted by User ${reaction.user_id}`}
                        >
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </span>
                {message.sender_id == currentUserId && (
                  <Avatar className="flex justify-center items-center">
                    <AvatarImage
                      src={session?.user?.image ? session?.user?.image : session?.user?.name?.charAt(0).toUpperCase()}
                      alt={message.name}
                      width={6}
                      height={6}
                    />
                    <AvatarFallback className="flex-1">
                      {/* {console.log("message-------", message)} */}
                      {message.sender_display_name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <button
                  onClick={() => handleReply(message)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Reply size={16} />
                </button>
              </div>

            </motion.div>

          ))}
        </AnimatePresence>
      </div>
      {replyTo && (
        <div className="bg-muted p-2 mb-2 rounded-md flex justify-between items-center">
          <div className="text-sm">
            Replying to: {replyTo?.chat_message}
          </div>
          <button
            onClick={handleCancelReply}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <ChatBottombar
        contactData={contactData} addMessage={addMessage} setMessages={setMessages} socket={socket}
        isMobile={isMobile} session={session} replyTo={replyTo} setReplyTo={setReplyTo}
        groupsData={groupsData} setFiles={setFiles} onFileUpload={handleFileUpload} />
    </div>
  );
}