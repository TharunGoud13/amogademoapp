// components/UserNav.tsx
'use client';

import * as React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Avatar } from "../ui/avatar";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useTheme } from "../context/themeContext";

export default function UserNav() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <Image src={session?.user?.image as string} alt="user-profile" height={100} width={100} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="fixed left-[-200px] top-[20px]">
        <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{session?.user?.email}</DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Themes</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('zinc')}>Zinc</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('blue')}>Blue</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('green')}>Green</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('purple')}>Purple</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

