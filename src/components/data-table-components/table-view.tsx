"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { BarChartIcon, Calendar, Columns, Grid, List, SlidersHorizontal, Table, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";


const buttonClass = "h-8 border  shadow-sm  transition-colors"
export function TableView({setViewType}: {setViewType: (viewType: "table" | "card" | "list" | "chart") => void}) {
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={cn(buttonClass, "px-2 lg:px-3")}>
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden lg:inline-block ml-2">View</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setViewType("table")}>
            <Table className="mr-2 h-4 w-4" />
            Table View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setViewType("card")}>
            <Grid className="mr-2 h-4 w-4" />
            Card View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setViewType("list")}>
            <List className="mr-2 h-4 w-4" />
            List View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setViewType("chart")}>
            <BarChartIcon className="mr-2 h-4 w-4" />
            Charts
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Workflow className="mr-2 h-4 w-4" />
            Flow
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}