import { logout } from "@/app/actions";
import { auth } from "@/auth";
import Link from "next/link";
import { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { BsChat } from "react-icons/bs";
import Image from "next/image";
import { BsMoonStarsFill } from "react-icons/bs";
import {Popover} from "antd"

const TopBar: FC = async () => {
  const session = await auth();


  if (!session?.user) return null;


  return (
    <div className="bg-white flex items-center justify-between shadow-sm fixed p-2.5 w-full z-[1000]">
      <div className="flex gap-3.5 items-center justify-between">
        <Link href={'/'} className="relative gap-2.5 z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          morr
        </Link>
        
           <Link href="/salesanalytics">Dashboard</Link>
          <Link href="/storemenu">Menu</Link>
         {/* <h1>Dashboard</h1>
          <h1>Menu</h1>*/}
      
      </div>
      <div className="flex gap-3 items-center">
        <form action={logout}>
        <button className="p-2.5 font-semibold  rounded-lg bg-gray-100">
          Logout
        </button>
        </form>
        <Link href="/store_chat">
        <BsChat className="h-[24px] w-[24px] mr-2 cursor-pointer" />
        </Link>
        <Popover trigger="hover" placement="bottom">
        <Avatar className="cursor-pointer">
            <Image src={session?.user?.image as string} height={100} width={100} alt="user-profile"/>
            {/* <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback> */}
        </Avatar>
        </Popover>
        <BsMoonStarsFill height={24} width={24} className="h-[24px] cursor-pointer w-[24px]"/>
      </div>
    </div>
  );
};

export default TopBar;
