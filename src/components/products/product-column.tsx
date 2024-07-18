// column names
"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "../ui/badge"
import { Checkbox } from "../ui/checkbox"

// import { labels, priorities, statuses } from "../data/data"
// import { labels,priorities,statuses } from "@/constants/taskdata"
import { statuses,priorities } from "@/constants/productdata"
import {  } from "@/constants/productdata"
// import { Task } from "../data/schema"
import { Task } from "@/constants/schema"
// import { DataTableRowActions } from "./data-table-row-actions"
// import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableColumnHeader } from "./product-table-column-header"
import { DataTableRowActions } from "./product-table-row-actions"




export const columns: ColumnDef<Task>[] = [
  
    {
        accessorKey: "order_id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="order_id" />
        ),
        // cell: ({ row }) => {
        //   const label = labels.find((label) => label.value === row.original.label)
    
        //   return (
        //     <div className="flex space-x-2">
        //       {label && <Badge variant="outline">{label.label}</Badge>}
        //       <span className="max-w-[500px] truncate font-medium">
        //         {row.getValue("title")}
        //       </span>
        //     </div>
        //   )
        // },
      },
  {
    accessorKey: "item_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="item_id" />
    ), 
  },
  {
    accessorKey: "product_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="product_id" />
    ), 
  },
  {
    accessorKey: "variation_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="variation_id" />
    ), 
  },
  {
    accessorKey: "business_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="business_number" />
    ), 
  },
  {
    accessorKey: "business_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="business_name" />
    ), 
  },
  {
    accessorKey: "order_status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="order_status" />
    ), 
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="quantity" />
    ), 
  },
  {
    accessorKey: "subtotal",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="subtotal" />
    ), 
  },
  {
    accessorKey: "subtotal_tax",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="subtotal_tax" />
    ), 
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="total" />
    ), 
  },
  {
    accessorKey: "total_tax",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="total_tax" />
    ), 
  },
  {
    accessorKey: "taxes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="taxes" />
    ), 
  },
  
  
  // three dots
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
