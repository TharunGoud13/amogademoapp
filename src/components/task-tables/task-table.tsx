"use client"

import * as React from "react"
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
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"


import { DataTablePagination } from "./data-table-pagination"
// import { DataTableToolbar } from "./data-table-toolbar"
import { DataTableToolbar } from "./data-table-toolbar"
import { loginLog } from "@/lib/store/actions"
import { connect } from "react-redux"
import { context, trace } from "@opentelemetry/api"
import IpAddress from "@/lib/IpAddress"
import { useSession } from "next-auth/react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const TaskTable: React.FC<any> = ({
  columns,
  data,
  loginLog
}) => {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const { data: session }: any = useSession()
  const trackPageLoad = async () => {
    const tracer = trace.getTracer('mail--tracer');
    const currentTime = new Date().toUTCString();

    const span = tracer.startSpan('products-page-load', {
      attributes: {
        description: 'Products Page Viewed',
        user_id: session?.user?.id,
        user_name: session?.user?.name,
        user_email: session?.user?.email,
        event_type: "Mail Page",
        user_ip_address: await IpAddress(),

      }
    });

    context.with(trace.setSpan(context.active(), span), async () => {
      // Call loginLog action with the relevant data
      loginLog({
        description: 'Tasks Page Viewed',
        event_type: "Tasks Page",
        session: session?.user,
        user_ip_address: await IpAddress(),
      });
    });
    setTimeout(() => {
      span.end();
    }, 100);

    return () => {
      if (span.isRecording()) {
        span.end();
      }
    }
  };


  React.useEffect(() => {
    trackPageLoad()
  }, [])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
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
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="space-y-4 pt-5">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
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
                    <TableCell key={cell.id}>
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
      <DataTablePagination table={table} />
    </div>
  )
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {
  loginLog
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskTable)