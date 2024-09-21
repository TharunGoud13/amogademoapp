"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { incomeType, categories } from "./data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
// import { DataTableViewOptions } from "@/components/ui/data-table-view-options";
import { CalendarDatePicker } from "@/components/calendar-date-picker";
import { useState } from "react";
import { DataTableViewOptions } from "./data-table-view-options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DownloadIcon, PlusIcon, XIcon } from "lucide-react";

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

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState("");
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

  const handleQuickSearch = (period: string) => {
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "Recent":
        startDate.setDate(now.getDate() - 7);
        break;
      case "Today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "This Week":
        startDate.setDate(now.getDate() - now.getDay());
        break;
      case "This Month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "This Year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    setDate(startDate);
  };

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

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting tasks...")
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
    table.getColumn("date")?.setFilterValue([from, to]);
  };

  const clearFilters = () => {
    setFilters([{ field: "status", operator: "equals", value: "" }]);
    setSearch("");
    setDate(undefined);
    setSortConfig({ key: "id", direction: null });
  };

  return (
    <div className="flex flex-col">
      <Input
        placeholder="Search"
        value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
        onChange={(event) => {
          table.getColumn("id")?.setFilterValue(event.target.value);
        }}
        className="border-secondary"
      />

      <div className="flex my-2.5 gap-2 flex-wrap">
        {["Recent", "Today", "This Week", "This Month", "This Year"].map(
          (period) => (
            <Button
              key={period}
              variant="outline"
              size="sm"
              onClick={() => handleQuickSearch(period)}
              className="rounded-full"
            >
              {period}
            </Button>
          )
        )}
      </div>
      <div className="flex flex-col flex-wrap gap-2.5 w-full ">
        {filters.map((filter, index) => (
          <div key={index} className="flex flex-wrap w-full gap-2.5">
            <Select
              value={filter.field}
              onValueChange={(value) => updateFilter(index, "field", value)}
            >
              <SelectTrigger className="w-[140px] flex-grow">
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
              <SelectTrigger className="w-[140px] flex-grow">
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
              className="flex-grow min-w-[100px] max-w-[200px]"
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
      <div className="mt-3 flex flex-wrap items-center gap-2.5">
        <Button onClick={addFilter}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add filter
        </Button>
        {/* <Button variant="outline" onClick={() => table.resetColumnFilters()}>
          Clear
        </Button> */}
        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
        <CalendarDatePicker
          date={dateRange}
          onDateSelect={handleDateSelect}
          className="w-[250px] h-8"
          variant="outline"
        />
        <Button onClick={handleNew}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New
        </Button>
        <Button onClick={handleExport}>
          <DownloadIcon className="h-4 w-4 mr-2" />
          Export
        </Button>
      <DataTableViewOptions table={table} />

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
