import React, { FC, useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { UserData } from '@/app/data';
import { Info, Phone, Video } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider } from '../ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import AddGroupUsers from './addGroupUsers';
import { connect } from 'react-redux';
import { getChatGroupUsers } from '@/lib/store/actions';
import { IoMdAdd } from "react-icons/io";

interface ChatTopbarProps {
  selectedUser: any;
  contactData: any;
  groupsData: any;
  getChatGroupUsers:any;
  getChatGroupUsersResponse:any
}


const ChatTopbar:FC<ChatTopbarProps> = ({ contactData, groupsData,getChatGroupUsers, getChatGroupUsersResponse})  => {
  const [groupUsers, setGroupUsers] = useState<any[]>([]);


  useEffect(() => {
    const fetchData = async () => {
      await getChatGroupUsers();
      if (getChatGroupUsersResponse && getChatGroupUsersResponse.length > 0) {
        setGroupUsers(getChatGroupUsersResponse);
      }
    };

    fetchData();
  }, [getChatGroupUsers,getChatGroupUsersResponse]);



  const displayData = (contactData && contactData[0]) || (groupsData && groupsData[0]) || {};

  const currentGroupUsers = groupUsers && groupUsers.filter(((user: any,) => user?.group_id === (groupsData && groupsData[0])?.chat_group_id))


  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <Avatar className="flex justify-center items-center">
          {displayData?.profile_url || displayData?.icon ?
            <AvatarImage
              src={displayData.profile_url || displayData.icon}
              alt={displayData.user_name || displayData.group_name}
              width={6}
              height={6}
              className="w-10 h-10 "
            /> :
            <AvatarFallback>
              {(displayData?.user_name?.charAt(0) || displayData?.group_name?.charAt(0))?.toUpperCase()}
            </AvatarFallback>}
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{displayData?.user_name || displayData?.group_name}</span>
          {displayData?.status && <span className="text-xs">{displayData.status}</span>}
        </div>
        <div className='ml-[10px] flex cursor-pointer'>
          <Avatar>
            <Popover>
              <PopoverTrigger asChild>
          <AvatarFallback className='text-xl font-[200] flex flex-col justify-center items-center'><IoMdAdd /></AvatarFallback>
          </PopoverTrigger>
          <PopoverContent className='absolute h-[60vh] w-[25vw] overflow-x-hidden overflow-y-auto'>
            <AddGroupUsers groupsData={groupsData}/>
          </PopoverContent>
          </Popover>
          </Avatar>
        </div>
        <div className='flex gap-3 ml-5'>
          {currentGroupUsers && currentGroupUsers.length > 0 && currentGroupUsers.map((user: any, index: any) => <div key={index}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar>
                    <AvatarFallback>{user?.user_name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{user?.user_name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>)}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state:any) => ({
  getChatGroupUsersResponse:state.getChatGroupUsersResponse
})

const mapDispatchToProps = {
  getChatGroupUsers
}

export default connect(mapStateToProps,mapDispatchToProps)(ChatTopbar);