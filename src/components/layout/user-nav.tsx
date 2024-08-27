
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

export default  async function UserNav() {
  const session = await auth()
    

  return (
    <DropdownMenu>
  <DropdownMenuTrigger>
    {session?.user?.image ?
    <Avatar>
      <Image src={session?.user?.image as string} alt="user-profile" height={100} width={100} />
    </Avatar> : <Avatar><AvatarFallback>{session?.user?.name?.charAt(0).toUpperCase()}</AvatarFallback></Avatar>}
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


