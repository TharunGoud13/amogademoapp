"use client";
import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Operator =
  | "Equals"
  | "Does Not Equal"
  | "Begins With"
  | "Contains"
  | "Empty"
  | "Not Empty"
  | "More Than"
  | "Less Than";

const OPERATORS = [
  "Equals",
  "Does Not Equal",
  "Begins With",
  "Contains",
  "Empty",
  "Not Empty",
  "More Than",
  "Less Than",
] as const;

type Task = {
  id: string;
  title: string;
  status: "Todo" | "In-Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  createdAt: Date;
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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [activePeriod, setActivePeriod] = useState<DatePeriod>("Recent");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });
  const [fromDate, setFromDate] = useState<any>(undefined);
  const [toDate, setToDate] = useState<any>(undefined);

  const [selectedColumn, setSelectedColumn] = useState<string | undefined>(
    undefined
  );
  const [selectedOperator, setSelectedOperator] = useState<string | undefined>(
    undefined
  );
  const [filters, setFilters] = useState<any>([
    { id: "1", column: "", operator: "", value: "" },
  ]);
  const [filterApplied, setFilterApplied] = useState(false);

  const handleQuickSearch = useCallback((period: DatePeriod) => {
    const now = new Date();
    let from = new Date();

    switch (period) {
      case "Recent":
        from.setDate(now.getDate() - 10);
        break;
      case "Today":
        from.setDate(now.getDate() - 1);
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

    // setFromDate(from);
    // setToDate(now);
    applyDateFilter(from, now);
    setActivePeriod(period);
  }, []);

  const applyDateFilter = (from: Date, to: Date) => {
    const column = table.getColumn("date_created");
    if (column) {
      // Create a new Date object for the end of the 'to' date
      const endOfDay = new Date(to);
      endOfDay.setHours(23, 59, 59, 999);
      
      column.setFilterValue([from, endOfDay]);
    }
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setFromDate(today);
    setToDate(today);
    applyDateFilter(today, today);
    setActivePeriod("Today");
  }, []);

  useEffect(() => {
    handleQuickSearch("Recent");
  }, [handleQuickSearch]);

  const handleFromDateSelect = (date: Date | undefined) => {
    if (date) {
      setFromDate(date);
      applyDateFilter(date, toDate);
    }
  };

  const handleToDateSelect = (date: Date | undefined) => {
    if (date) {
      setToDate(date);
      applyDateFilter(fromDate, date);
    }
  };

  const dateFilterFn = useCallback(
    (row: any, columnId: string, filterValue: [Date, Date]) => {
      const cellValue: string = row.getValue(columnId);
      if (!cellValue) return false;

      const dateValue = new Date(cellValue);
      const [start, end] = filterValue;
      return dateValue >= start && dateValue <= end;
    },
    []
  );

  useEffect(() => {
    const column = table.getColumn("date_created");
    if (column) {
      column.columnDef.filterFn = dateFilterFn;
      table.setSorting([{ id: "date_created", desc: true }]);
    }
  }, [table, dateFilterFn]);

  useEffect(() => {
    if (activePeriod === "Recent") {
      table.setPageSize(10);
      table.setPageIndex(0);
    } else {
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
    };
    // setTasks((prevTasks) => [...prevTasks, newTask])
  };

  const buttonClass = "h-8 border shadow-sm  transition-colors";

  const handleDateSelect = ({ from, to }: { from: Date; to: Date }) => {
    setDateRange({ from, to });
    table.getColumn("date_created")?.setFilterValue([from, to]);
  };

  const clearFilters = () => {
    table.resetColumnFilters();
    setActivePeriod("Recent");
    handleQuickSearch("Recent");
    setDate(undefined);
    // setIsFilterActive(false)
    setFilterApplied(false);
    setSelectedColumn("");
    setSelectedOperator("");
    setFilters([{ column: "", operator: "", value: "" }]);
    // setFilterValue("")
    setDateRange({
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date(),
    });
  };

  const tableColumns = table.getAllColumns().map((column) => column.id);

  // Define your custom filter function outside of your component

  const addFilterRow = () => {
    const newFilter: any = {
      id: Date.now().toString(),
      column: "",
      operator: "",
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilterRow = (id: string) => {
    setFilters(filters.filter((filter: any) => filter.id !== id));
  };

  const updateFilter = (id: string, field: keyof any, value: string) => {
    setFilters(
      filters.map((filter: any) =>
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );
  };

  // In your DataTableToolbar component, handle applying the filter
  const applyFilter = () => {
    filters.forEach((filter: any) => {
      if (filter.column && filter.operator) {
        const filterValueObj = {
          operator: filter.operator,
          value: filter.value,
        };
        table.getColumn(filter.column)?.setFilterValue(filterValueObj);
        setFilterApplied(true);
      }
    });
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
      {filters.map((filter: any, index: any) => (
        <div
          key={filter.id}
          className="flex flex-wrap md:flex-nowrap  my-2.5 gap-2 items-center"
        >
          <Select
            onValueChange={(value) => updateFilter(filter.id, "column", value)}
            value={filter.column}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Column" />
            </SelectTrigger>
            <SelectContent>
              {tableColumns.map((columnName) => (
                <SelectItem key={columnName} value={columnName}>
                  {columnName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              updateFilter(filter.id, "operator", value)
            }
            value={filter.operator}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Operator" />
            </SelectTrigger>
            <SelectContent>
              {OPERATORS.map((operator) => (
                <SelectItem key={operator} value={operator}>
                  {operator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter value"
            value={filter.value}
            onChange={(event) =>
              updateFilter(filter.id, "value", event.target.value)
            }
            className="border-secondary"
          />

          <Button
            variant="outline"
            onClick={() => removeFilterRow(filter.id)}
            className={cn(buttonClass)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <div className="flex flex-wrap mt-3 items-center justify-between">
        <div className=" flex flex-wrap items-center gap-2.5">
          <TableView />
          <DataTableViewOptions table={table} />
          <div className="flex items-center flex-wrap md:flex-nowrap my-2.5 gap-4">
            <span>From</span>
            <CalendarDatePicker
              date={fromDate}
              onDateSelect={handleFromDateSelect}
              placeholder="From Date"
            />
            <span>To</span>
            <CalendarDatePicker
              date={toDate}
              onDateSelect={handleToDateSelect}
              placeholder="To Date"
            />
          </div>
          <Button
            variant="outline"
            onClick={addFilterRow}
            className={cn(buttonClass, "w-8 p-0")}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={applyFilter}
            className={cn(buttonClass, "w-8 p-0")}
          >
            <Filter
              className={`${
                filterApplied
                  ? "fill-blue-500 text-blue-500   hover:fill-blue-500"
                  : ""
              } h-4  w-4`}
            />
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
    </div>
  );
}
