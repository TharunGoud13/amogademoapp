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
import { DataTableColumnHeader } from "./bom-table-column-header"
import { DataTableRowActions } from "./bom-table-row-actions"




export const columns: ColumnDef<Task>[] = [
  
    // {
    //     accessorKey: "order_id",
    //     header: ({ column }) => (
    //       <DataTableColumnHeader column={column} title="order_id" />
    //     ),
    //     // cell: ({ row }) => {
    //     //   const label = labels.find((label) => label.value === row.original.label)
    
    //     //   return (
    //     //     <div className="flex space-x-2">
    //     //       {label && <Badge variant="outline">{label.label}</Badge>}
    //     //       <span className="max-w-[500px] truncate font-medium">
    //     //         {row.getValue("title")}
    //     //       </span>
    //     //     </div>
    //     //   )
    //     // },
    //   },
  {
    accessorKey: "bom_raw_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="bom_raw_name" />
    ), 
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="status" />
    ), 
  },
  {
    accessorKey: "part_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="part_no" />
    ), 
  },
  {
    accessorKey: "part_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="part_name" />
    ), 
  },
  {
    accessorKey: "c",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="c" />
    ), 
  },
  {
    accessorKey: "d",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="d" />
    ), 
  },
  {
    accessorKey: "sec",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="sec" />
    ), 
  },
  {
    accessorKey: "item",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="item" />
    ), 
  },
  {
    accessorKey: "sgr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="sgr" />
    ), 
  },
  {
    accessorKey: "loc_1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="loc_1" />
    ), 
  },
  {
    accessorKey: "loc_1_c",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="loc_1_c" />
    ), 
  },
  {
    accessorKey: "loc_2",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="loc_2" />
    ), 
  },
  {
    accessorKey: "loc_2_c",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="loc_2_c" />
    ), 
  },
  {
    accessorKey: "loc_3",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="loc_3" />
    ), 
  },
  {
    accessorKey: "loc_3_c",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="loc_3_c" />
    ), 
  },
  {
    accessorKey: "model_31xajb6",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="model_31xajb6" />
    ), 
  },
  {
    accessorKey: "model_31xajc6",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="model_31xajc6" />
    ), 
  },
  {
    accessorKey: "model_31xajd5",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="model_31xajd5" />
    ), 
  },
  {
    accessorKey: "model_6rpaja5",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="model_6rpaja5" />
    ), 
  },
  {
    accessorKey: "model_6rpaja6",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="model_6rpaja6" />
    ), 
  },
  {
    accessorKey: "model_6rsacj1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="model_6rsacj1" />
    ), 
  },
  {
    accessorKey: "share",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="share" />
    ), 
  },
  {
    accessorKey: "plant",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="plant" />
    ), 
  },
  {
    accessorKey: "family",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="family" />
    ), 
  },
  {
    accessorKey: "p_mp_code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="p_mp_code" />
    ), 
  },
  {
    accessorKey: "l1_part_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="l1_part_no" />
    ), 
  },
  {
    accessorKey: "gr",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="gr" />
    ), 
  },
  {
    accessorKey: "parent_part_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="parent_part_no" />
    ), 
  },
  {
    accessorKey: "qty_l1",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="qty_l1" />
    ), 
  },
  {
    accessorKey: "parent_seq",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="parent_seq" />
    ), 
  },
  {
    accessorKey: "seq",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="seq" />
    ), 
  },
  {
    accessorKey: "sgrseq",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="sgrseq" />
    ), 
  },
  {
    accessorKey: "env",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="env" />
    ), 
  },
  {
    accessorKey: "sn",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="sn" />
    ), 
  },
  {
    accessorKey: "hns",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="hns" />
    ), 
  },
  {
    accessorKey: "hg_target_weight",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="hg_target_weight" />
    ), 
  },
  {
    accessorKey: "basic_part_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="basic_part_no" />
    ), 
  },
  {
    accessorKey: "appl_dc_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="appl_dc_no" />
    ), 
  },
  {
    accessorKey: "dwg_issue_dc_no",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="dwg_issue_dc_no" />
    ), 
  },
  {
    accessorKey: "femd",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="femd" />
    ), 
  },
  {
    accessorKey: "begin_datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="begin_datetime" />
    ), 
  },
  {
    accessorKey: "end_datetime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="end_datetime" />
    ), 
  },
  {
    accessorKey: "x_cvt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="x_cvt" />
    ), 
  },
  {
    accessorKey: "z_cvt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="z_cvt" />
    ), 
  },
  {
    accessorKey: "z_plus_cvt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="z_plus_cvt" />
    ), 
  },
  {
    accessorKey: "business_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="business_name" />
    ), 
  },
  
  
  
  // three dots
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
