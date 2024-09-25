
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

export default  async function UserNav() {
  const session = await auth()
    

  return (
    <DropdownMenu>
  <DropdownMenuTrigger>
    <Avatar className="flex items-center justify-center">
      <FontAwesomeIcon icon={faUser} className="text-2xl text-primary"/>
    </Avatar>
    {/* {session?.user?.image ?
    <Avatar>
      <Image src={session?.user?.image as string} alt="user-profile" height={100} width={100} />
    </Avatar> : <Avatar><AvatarFallback className="bg-secondary">{session?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>} */}
  </DropdownMenuTrigger>
  <DropdownMenuContent className=" fixed left-[-200px] top-[20px] ">
    <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <Link href="/profile">
    <DropdownMenuItem>{session?.user?.email}</DropdownMenuItem>
    </Link>
    {/* <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem> */}
  </DropdownMenuContent>
</DropdownMenu>

  );
}


