"use client"
import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { DataTablePagination } from "../data-table-components/data-table-pagination";
import { DataTableToolbar } from "../data-table-components/data-table-toolbar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { CheckSquare, ClipboardList, Edit, MessageCircle, MoreVertical } from "lucide-react";
import { DataTableRowActions } from "../data-table-components/data-table-row-actions";
import ChartsView from "./ChartsView";
import FlowView from "./FlowView";

type ColumnMetaType = {
  className?: string;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

type ViewType = "table" | "card" | "list" | "chart" | "flow";

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [viewType, setViewType] = useState<ViewType>("table");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });


  const renderTableView = () => (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto hidden md:block relative">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={(header.column.columnDef.meta as ColumnMetaType)?.className}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={(cell.column.columnDef.meta as ColumnMetaType)?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {table.getRowModel().rows.length === 0 && <h1 className="text-center w-screen">No Data.</h1>}
      {table.getRowModel().rows.map((row) => {
        const order = row.original as any;
        return (
          <Card key={order.id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold">{order.number}</h3>
                  <p className="text-sm text-gray-500">{new Date(order.date_created).toLocaleDateString("en-GB",{day:'2-digit',month:'2-digit',year:'numeric'})}</p>
                </div>
                <Badge variant={order.status === 'completed' ? 'default' : order.status === 'cancelled' ? "destructive" : "secondary"}>
                  {order.status}
                </Badge>
              </div>
              <div className="mb-4">
                <p className="font-semibold">{order.billing.first_name} {order.billing.last_name}</p>
                <p className="text-sm">{order.billing.email}</p>
                <p className="text-sm">{order.billing.phone}</p>
              </div>
              <div className="text-xl font-bold mb-4">
                {order.currency_symbol}  {parseFloat(order.total).toFixed(2)}
              </div>
              <div className="flex justify-between   items-center space-x-2">
                <div>
                <Button variant="ghost" size="icon"><Edit className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><MessageCircle className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><CheckSquare className="h-5 w-5" /></Button>
                </div>
                <div>
                <DataTableRowActions row={row} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <ul className="divide-y hidden md:block divide-gray-200">
      {table.getRowModel().rows.map((row) => (
        <li key={row.id} className="py-4">
          {row.getVisibleCells().map((cell) => (
            <div key={cell.id} className="mb-1">
              <strong>{cell.column.columnDef.header as string}: </strong>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </li>
      ))}
    </ul>
  );

  const renderChartView = () => (
    <div>
      <ChartsView chartData={table.getRowModel().rows.map((row) => row.original as any)}/>
    </div>
  );

  const renderFlowView = () => (
    <div>
      <FlowView data={table.getRowModel().rows.map((row) => row.original as any)}/>
    </div>
  )

  const renderView = () => {
    switch (viewType) {
      case "table":
        return renderTableView();
      case "card":
        return renderCardView();
      case "list":
        return renderListView();
      case "chart":
        return renderChartView();
      case "flow":
        return renderFlowView()
      default:
        return renderTableView();
    }
  };

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} setViewType={setViewType} />
      <div className={`${viewType == "card" ? "block" : "md:hidden"} `}>
        {renderCardView()}
      </div>
      {renderView()}
      <DataTablePagination table={table} />
    </div>
  );
}