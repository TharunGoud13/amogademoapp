"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CalendarCheck, Eye, FileText, Mail, MessageCircle, Share } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row
}: DataTableRowActionsProps<TData>) {
  return (
    <div className="relative flex justify-center items-center h-full">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4"/>
            View
            </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4"/>
            PDF</DropdownMenuItem>
          <DropdownMenuItem>
            <Share className="mr-2 h-4 w-4"/>
            Share</DropdownMenuItem>
          <DropdownMenuItem>
            <MessageCircle className="mr-2 h-4 w-4"/>
            Chat</DropdownMenuItem>
          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4"/>Email</DropdownMenuItem>
          <DropdownMenuItem>
            <CalendarCheck className="mr-2 h-4 w-4"/>
            Task</DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem>
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}