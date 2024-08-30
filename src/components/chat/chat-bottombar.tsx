import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  Smile,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect,useCallback, useRef, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Message } from "@/app/data";
import { Textarea } from "../ui/textarea";
import { EmojiPicker } from "../emoji-picker";
import { v4 as uuidv4 } from "uuid";
import Cookies from "js-cookie";


import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CREATE_CHAT_MESSAGE } from "@/constants/envConfig";

interface ChatBottombarProps {
  isMobile: boolean;
  session: any;
  socket: any;
  setMessages: any;
  addMessage: any;
  contactData: any;
  replyTo: any;
  setReplyTo: any;
  groupsData: any;
  setFiles: any;
  onFileUpload: (fileInfo: { id: string, name: string, url: string }) => void;
}

export const BottombarIcons = [{ icon: Paperclip }];

export default function ChatBottombar({
  isMobile, session, socket, setMessages, addMessage, contactData, replyTo, setReplyTo, groupsData, setFiles, onFileUpload
}: ChatBottombarProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  // getting message receiver_user_id from contactData from userCatalog api
  let receiver_user_id = contactData && contactData[0]?.user_catalog_id
  let receiver_group_id = groupsData && groupsData[0]?.chat_group_id
  let cookiesData = Cookies.get('currentUser')
  const userData = cookiesData ? JSON.parse(cookiesData) : null;
  const sender_id = userData?.user_catalog_id;

  
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = event.target.value;
    setMessage(newMessage);
  
    if (newMessage.trim()) {
      socket.emit("typing", { userId: sender_id, room: "user" });
    } else {
      socket.emit("stop_typing", { userId: sender_id, room: "user" });
    }

  };

  // generate random number for each chat message to give value for chat_message_id
  function generateRandomId() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  // getting user_catalog_id from cookies


  const handleThumbsUp = () => {
    const newMessage: Message = {
      id: uuidv4(),
      name: session?.user.name,
      avatar: session?.user.image,
      message: "👍",
      room: "user",
      chat_message: message,
    };
    // sendMessage(newMessage);
    addMessage(newMessage)
    socket.emit("send_msg", newMessage)
    setMessage("");
  };

  // modified handleSend function to send messages to api and using socket to emit the messages to socket sever
  // new message is to send for socket and payload is static data for api payload
  const handleSend = async () => {
    if (message.trim()) {
      const newMessageId = generateRandomId()
      const newMessage: any = {
        id: uuidv4(),
        status: "sent",
        chat_message_type: "customer_order-notifier",
        chat_message: message.trim(),
        reactions: [],
        receiver_user_id: receiver_user_id,
        receiver_group_id: receiver_group_id,
        sender_id: sender_id,
        room: "user",
        sender_display_name: userData?.user_name,
        chat_message_id: newMessageId,
        replied_to_message_id: replyTo?.chat_message_id || null,
      };

      const payload = {
        status: "sent",
        chat_message_type: "customer_order-notifier",
        chat_message: message.trim(),
        reactions: [],
        receiver_user_id: receiver_user_id,
        receiver_group_id: receiver_group_id,
        sender_id: sender_id,
        chat_message_id: newMessageId,

        replied_to_message_id: replyTo?.chat_message_id || null,
      };

      const myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBpX3VzZXIifQ.Ks_9ISeorCCS73q1WKEjZHu9kRx107eOx5VcImPh9U8");
      myHeaders.append("Content-Type", "application/json");

      const requestOptions: RequestInit = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(payload),
        redirect: "follow"
      };

      try {
        // Make API call with the specified payload
        const response = await fetch(CREATE_CHAT_MESSAGE, requestOptions);
        const responseBody = await response.text();
        // If the API call is successful, update the UI
        if (response.ok) {
          socket.emit("send_msg", newMessage);
          addMessage(newMessage);
          setReplyTo(null);
          setMessage("");

          if (inputRef.current) {
            inputRef.current.focus();
          }
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }


    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;


    const reader = new FileReader();
    reader.onload = async (event) => {
      const binaryString = event.target?.result;
      if (typeof binaryString !== 'string') return;

      const base64String = btoa(binaryString);

      const newFile: any = {
        id: uuidv4(),
        status: "sent",
        chat_message_type: "file",
        receiver_user_id: receiver_user_id,
        receiver_group_id: receiver_group_id,
        sender_id: sender_id,
        room: "user",
        sender_display_name: userData?.user_name,
        document_file: base64String,
        document_name: file.name,
        document_type: file.type,
      };

      const payload: any = {
        document_file: base64String,
        document_name: file.name,
        document_type: file.type,
        receiver_user_id: receiver_user_id,
        receiver_group_id: receiver_group_id,
        sender_id: sender_id,
      }

      try {
        const response = await fetch("https://no0wgko.219.93.129.146.sslip.io/document", {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYXBpX3VzZXIifQ.Ks_9ISeorCCS73q1WKEjZHu9kRx107eOx5VcImPh9U8",
          },
        });


        if (response.ok) {
          addMessage(newFile)
          onFileUpload(payload);
          console.log("File Uploaded Successfully")
        } else {
          console.error('Failed to upload file');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    reader.readAsBinaryString(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  }

  return (
    <div className="p-2 flex justify-between w-full items-center gap-2">
      <div className="flex">

        {!message.trim() && !isMobile && (
          <div className="flex">
            <input type="file" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            <button onClick={handleUploadClick}
              className="  text-gray-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"><Paperclip /></button>
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="w-full relative"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <Textarea
            autoComplete="off"
            value={message}
            ref={inputRef}
            onKeyDown={handleKeyPress}
            onChange={handleInputChange}
            name="message"
            placeholder="Type your message..."
            className=" w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
          ></Textarea>
          <div className="absolute right-2 bottom-0.5  ">
            <EmojiPicker onChange={(value) => {
              setMessage(message + value)
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }} />
          </div>
        </motion.div>

        {message.trim() ? (
          <Button
            onClick={handleSend}
          >
            Send
          </Button>
        ) : (
          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
            )}
            onClick={handleThumbsUp}
          >
            <ThumbsUp size={20} className="text-muted-foreground" />
          </Link>
        )}
      </AnimatePresence>
    </div>
  );
}