import React, { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DatePeriod = "Recent" | "Today" | "This Week" | "This Month" | "This Year";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableDateHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const [activePeriod, setActivePeriod] = useState<DatePeriod | null>(null);

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleQuickSearch = (period: DatePeriod) => {
    const now = new Date();
    let from = new Date();

    switch (period) {
      case "Recent":
        from.setDate(now.getDate() - 10)
        break;
      case "Today":
        from.setDate(now.getDate());
        break;
      case "This Week":
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        from.setDate(now.getDate() - diffToMonday);
        break;
      case "This Month":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "This Year":
        from = new Date(now.getFullYear(), 0, 1);
        break;
    }

    if (column) {
      column.setFilterValue([from, now]);
    }

    setActivePeriod(period);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {activePeriod ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleQuickSearch("Recent")}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Recent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickSearch("Today")}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickSearch("This Week")}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            This Week
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickSearch("This Month")}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            This Month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleQuickSearch("This Year")}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            This Year
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
  );
}
