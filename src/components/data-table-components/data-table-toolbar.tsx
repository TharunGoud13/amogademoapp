"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { incomeType, categories } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
// import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import React, { useCallback, useEffect, useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Download,
  DownloadIcon,
  FileIcon,
  FileSpreadsheet,
  FileText,
  Filter,
  PlusIcon,
  XIcon,
} from "lucide-react";
import { TableView } from "./table-view";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

type Task = {
  id: string;
  title: string;
  status: "Todo" | "In-Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  createdAt: Date;
};

type SortConfig = {
  key: keyof Task;
  direction: "asc" | "desc" | null;
};

type Filter = {
  field: string;
  operator: string;
  value: string;
};

const DATE_PERIODS = [
  "Recent",
  "Today",
  "This Week",
  "This Month",
  "This Year",
] as const;
type DatePeriod = (typeof DATE_PERIODS)[number];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [activePeriod, setActivePeriod] = useState<DatePeriod>("Recent");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "id",
    direction: null,
  });
  const [filters, setFilters] = useState<Filter[]>([
    { field: "status", operator: "equals", value: "" },
  ]);

  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  const handleQuickSearch = useCallback(
    (period: DatePeriod) => {
      const now = new Date();
      let from = new Date();

      switch (period) {
        case "Recent":
          // For "Recent", we'll use a custom filter function instead of a date range
          break;
        case "Today":
          from = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "This Week":
          from.setDate(now.getDate() - now.getDay());
          break;
        case "This Month":
          from = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "This Year":
          from = new Date(now.getFullYear(), 0, 1);
          break;
      }

      // Apply the date filter to the table
      const column = table.getColumn("date_created");
      if (column) {
        if (period === "Recent") {
          column.setFilterValue("recent");
        } else {
          column.setFilterValue([from, now]);
        }
      }
      setActivePeriod(period);
    },
    [table]
  );

  // Custom filter function for date range and recent records
  const dateFilterFn = useCallback(
    (row: any, columnId: string, filterValue: [Date, Date] | "recent") => {
      const cellValue: string = row.getValue(columnId);
      if (!cellValue) return false;

      const dateValue = new Date(cellValue);

      if (filterValue === "recent") {
        // For "Recent", we don't filter here. We'll handle it in sorting and pagination.
        return true;
      } else {
        const [start, end] = filterValue;
        return dateValue >= start && dateValue <= end;
      }
    },
    []
  );

  // Set the custom filter function for the date_created column and initial sorting
  useEffect(() => {
    const column = table.getColumn("date_created");
    if (column) {
      column.columnDef.filterFn = dateFilterFn;

      // Set initial sorting
      table.setSorting([{ id: "date_created", desc: true }]);
    }

    // Apply "Recent" filter by default
    handleQuickSearch("Recent");
  }, [table, dateFilterFn, handleQuickSearch]);

  // Custom pagination for "Recent" filter
  useEffect(() => {
    if (activePeriod === "Recent") {
      table.setPageSize(10);
      table.setPageIndex(0);
    } else {
      // Reset to default pagination if needed
      table.resetPageSize();
      table.resetPageIndex();
    }
  }, [activePeriod, table]);

  const handleNew = () => {
    const newTask: Task = {
      id: `TASK-${Math.floor(Math.random() * 10000)}`,
      title: "New Task",
      status: "Todo",
      priority: "Medium",
      createdAt: new Date(),
    }
    // setTasks((prevTasks) => [...prevTasks, newTask])
  }

  const buttonClass = "h-8 border shadow-sm  transition-colors"
  const handleExport = () => {
    // Implement export functionality
  }

  const addFilter = () => {
    setFilters([
      ...filters,
      { field: "status", operator: "equals", value: "" },
    ]);
  };

  const updateFilter = (index: number, field: string, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    // Filter table data based on selected date range
    table.getColumn("date_created")?.setFilterValue([from, to]);
  };

  const clearFilters = () => {
    table.resetColumnFilters();
    setActivePeriod("Recent");
    handleQuickSearch("Recent");
    setFilters([{ field: "status", operator: "equals", value: "" }]);
    setSearch("");
    setDate(undefined);
    setDateRange({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() });
    setSortConfig({ key: "id", direction: null });
  };

  return (
    <div className="flex flex-col">
      <Input
        placeholder="Search"
        value={(table.getColumn("billing")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.getColumn("billing")?.setFilterValue(event.target.value);
        }}
        className="border-secondary"
      />

      <div className="flex my-2.5 gap-2 flex-wrap">
        {DATE_PERIODS.map((period) => (
          <Button
            key={period}
            variant={activePeriod === period ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full border-secondary",
              activePeriod === period && "bg-primary text-primary-foreground"
            )}
            onClick={() => handleQuickSearch(period)}
          >
            {period}
          </Button>
        ))}
      </div>
      <div className="flex flex-col flex-wrap gap-2.5 w-full ">
        {filters.map((filter, index) => (
          <div key={index} className="flex flex-wrap w-full gap-2.5">
            <Select
              value={filter.field}
              onValueChange={(value) => updateFilter(index, "field", value)}
            >
              <SelectTrigger className="w-[140px] border-secondary flex-grow">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filter.operator}
              onValueChange={(value) => updateFilter(index, "operator", value)}
            >
              <SelectTrigger className="w-[140px] border-secondary flex-grow">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Equals</SelectItem>
                <SelectItem value="does not equal">Does Not Equal</SelectItem>
                <SelectItem value="begins with">Begins With</SelectItem>
                <SelectItem value="contains">Contains</SelectItem>
                <SelectItem value="empty">Empty</SelectItem>
                <SelectItem value="not empty">Not Empty</SelectItem>
                <SelectItem value="more than">More Than</SelectItem>
                <SelectItem value="less than">Less Than</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Enter value"
              value={filter.value}
              onChange={(e) => updateFilter(index, "value", e.target.value)}
              className="flex-grow min-w-[100px] border-secondary max-w-[200px]"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeFilter(index)}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap mt-3 items-center justify-between">
        <div className=" flex flex-wrap items-center gap-2.5">
          <TableView/>
          <DataTableViewOptions table={table} />

          {/* <Button onClick={addFilter}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add filter
        </Button> */}
          {/* <Button variant="outline" onClick={() => table.resetColumnFilters()}>
          Clear
        </Button> */}
          {/* <Button variant="outline" className="border-secondary" onClick={clearFilters}>
          Clear
        </Button> */}
          <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          />
          {/* <Button onClick={handleNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New
        </Button> */}
          <Button
            variant="outline"
            onClick={addFilter}
            className={cn(buttonClass, "w-8 p-0")}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={clearFilters}
            className={cn(buttonClass, "w-8 p-0 relative")}
          >
            <Filter className="h-4 w-4" />
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              +
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={cn(buttonClass, "w-8 p-0")}>
                <Download className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Download CSV
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Download Excel
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileIcon className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Button className="mt-2 md:mt-0" onClick={handleNew}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>
      </div>
      {/* {isFiltered && (
        <Button
          variant="ghost"
          onClick={() => table.resetColumnFilters()}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )} */}
    </div>
  );
}
