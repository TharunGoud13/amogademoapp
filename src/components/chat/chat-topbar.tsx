import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { UserData } from '@/app/data';
import { Info, Phone, Video } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';

interface ChatTopbarProps {
    selectedUser: any;
    contactData:any
    }
    
    export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];


export default function ChatTopbar({selectedUser,contactData}: ChatTopbarProps) {

  console.log("------------",contactData[0]?.username)
  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Avatar className="flex justify-center items-center">
            {contactData[0]?.avatar_url ? 
            <AvatarImage
              src={contactData[0].avatar_url}
              alt={contactData[0].name}
              width={6}
              height={6}
              className="w-10 h-10 "
            /> : <AvatarFallback>{contactData[0]?.username.charAt(0).toUpperCase()}</AvatarFallback>}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{contactData[0].username}</span>
            <span className="text-xs">Active 2 mins ago</span>
          </div>
        </div>

        <div>
          {TopbarIcons.map((icon, index) => (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
                "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
              )}
            >
              <icon.icon size={20} className="text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
  )
}