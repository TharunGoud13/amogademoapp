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
  MinusCircle,
  PlusCircle,
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
import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  setViewType: (viewType: "table" | "card" | "assistant" | "chart" | "flow" | "calendar") => void;
}

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
  setViewType,
}: DataTableToolbarProps<TData>) {
  const [activePeriod, setActivePeriod] = useState<DatePeriod>("Recent");
  const [fromDate, setFromDate] = useState<any>(undefined);
  const [toDate, setToDate] = useState<any>(undefined);
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

    setFromDate(from);
    setToDate(now);
    applyDateFilter(from, now);
    setActivePeriod(period);
    setFilterApplied(period !== "Recent");
  }, []);

  const applyDateFilter = (from: Date | undefined, to: Date | undefined) => {
    if (from && to) {
      const column = table.getColumn("date_created");
      if (column) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);

        column.setFilterValue([from, endOfDay]);
      }
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
    }
  };

  const handleToDateSelect = (date: Date | undefined) => {
    if (date) {
      setToDate(date);
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

  const buttonClass = "h-8 border shadow-sm  transition-colors";
  const clearFilters = () => {
    table.resetColumnFilters();
    setActivePeriod("Recent");
    handleQuickSearch("Recent");
    setFilterApplied(false);
    setFilters([{ column: "", operator: "", value: "" }]);
  };

  const tableColumns = table.getAllColumns().map((column) => column.id);

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

  const applyFilter = () => {
    applyDateFilter(fromDate, toDate);
    filters.forEach((filter: any) => {
      if (filter.column && filter.operator) {
        const filterValueObj = {
          operator: filter.operator,
          value: filter.value,
        };
        table.getColumn(filter.column)?.setFilterValue(filterValueObj);
      }
    });
    setFilterApplied(true);
  };

  // Utility function to flatten an object (handle nested fields dynamically)
  const flattenObject = (obj: any, parent = "", res: any = {}) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const propName = parent ? `${parent}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
          flattenObject(obj[key], propName, res); // Recursively flatten nested objects
        } else {
          res[propName] = obj[key]; // Assign the value
        }
      }
    }
    return res;
  };

  // Export table data as Excel (handling nested objects dynamically)
  const exportAsExcel = () => {
    const visibleColumns = table.getVisibleLeafColumns().map((col) => col.id);
    const tableData = table.getRowModel().rows.map((row: any) => {
      const filteredData: { [key: string]: any } = {};
      visibleColumns.forEach((colId) => {
        const value = row.getValue(colId);
        if (typeof value === "object" && value !== null) {
          const flattenedValues = flattenObject(value); // Flatten the object
          for (const key in flattenedValues) {
            if (visibleColumns.includes(key)) {
              filteredData[key] = flattenedValues[key]; // Include only if key is visible
            }
          }
        } else {
          if (visibleColumns.includes(colId)) {
            filteredData[colId] = value; // Only add if it's a visible column
          }
        }
      });

      // Include top-level keys that are not nested
      Object.keys(row.original).forEach((key) => {
        if (visibleColumns.includes(key) && !filteredData[key]) {
          filteredData[key] = row.original[key]; // Include only if it's a visible column and not already added
        }
      });

      return filteredData;
    });

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "table_data.xlsx");
  };

  // Export table data as CSV (handling nested objects dynamically)
  const exportAsCSV = () => {
    const visibleColumns = table.getVisibleLeafColumns().map((col) => col.id);
    const tableData = table.getRowModel().rows.map((row: any) => {
      const filteredData: { [key: string]: any } = {};
      visibleColumns.forEach((colId) => {
        const value = row.getValue(colId);
        if (typeof value === "object" && value !== null) {
          const flattenedValues = flattenObject(value); // Flatten the object
          for (const key in flattenedValues) {
            if (visibleColumns.includes(key)) {
              filteredData[key] = flattenedValues[key]; // Include only if key is visible
            }
          }
        } else {
          if (visibleColumns.includes(colId)) {
            filteredData[colId] = value; // Only add if it's a visible column
          }
        }
      });

      // Include top-level keys that are not nested
      Object.keys(row.original).forEach((key) => {
        if (visibleColumns.includes(key) && !filteredData[key]) {
          filteredData[key] = row.original[key]; // Include only if it's a visible column and not already added
        }
      });

      return filteredData;
    });

    const csv = Papa.unparse(tableData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "table_data.csv");
    link.click();
  };

  return (
    <div className="flex flex-col">
      <TooltipProvider>
        <Input
          placeholder="Search"
          value={(table.getColumn("billing")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            table.getColumn("billing")?.setFilterValue(event.target.value);
          }}
          className="border-secondary"
        />
        <div className="flex my-2.5 gap-2 items-center flex-wrap">
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
          <div className="flex items-center flex-wrap md:flex-nowrap my-2.5 gap-4">
            <div className="w-full flex items-center gap-2.5 md:w-fit">
              <span>From</span>
              <CalendarDatePicker
                date={fromDate}
                onDateSelect={handleFromDateSelect}
                placeholder="From Date"
              />
            </div>
            <div className="flex w-full items-center gap-7 md:gap-2.5 md:w-fit">
              <span>To</span>
              <CalendarDatePicker
                date={toDate}
                onDateSelect={handleToDateSelect}
                placeholder="To Date"
              />
            </div>
          </div>
        </div>

        {filters.map((filter: any, index: any) => (
          <div
            key={filter.id}
            className="flex flex-wrap md:flex-nowrap  my-2.5 gap-2 items-center"
          >
            <Select
              onValueChange={(value) =>
                updateFilter(filter.id, "column", value)
              }
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
            <div className="flex gap-2.5 w-full">
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
                className="border-secondary"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex  mt-3 gap-2.5 items-center md:justify-between">
          <div className=" flex  items-center gap-2.5">
            {/* <div className="hidden lg:inline">
            <DataTableViewOptions table={table} />
            </div> */}
            {/* <div className="flex items-center flex-wrap md:flex-nowrap my-2.5 gap-4">
              <div className="w-full flex items-center gap-2.5 md:w-fit">
                <span>From</span>
                <CalendarDatePicker
                  date={fromDate}
                  onDateSelect={handleFromDateSelect}
                  placeholder="From Date"
                />
              </div>
              <div className="flex w-full items-center gap-7 md:gap-2.5 md:w-fit">
                <span>To</span>
                <CalendarDatePicker
                  date={toDate}
                  onDateSelect={handleToDateSelect}
                  placeholder="To Date"
                />
              </div>
            </div> */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={addFilterRow}
                  className={cn(buttonClass, "w-8 p-0")}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Apply</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className={cn(buttonClass, "w-8 p-0 relative")}
                >
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Remove</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(buttonClass, "w-8 p-0")}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportAsCSV}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Download CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportAsExcel}>
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
          <div className="flex items-center gap-2.5">
            <DataTableViewOptions table={table} />
            <TableView setViewType={setViewType} />
            <Button className="mt-2 md:mt-0">
              <PlusIcon className="h-4 w-4 md:mr-2" />
             <span className="hidden md:inline">New</span>
            </Button>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
