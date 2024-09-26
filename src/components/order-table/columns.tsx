"use client";

import { ColumnDef } from "@tanstack/react-table";
// import { Expense } from "./schema"; // ts types
import { Expense } from "../data-table-components/schema";
// import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableColumnHeader } from "../data-table-components/data-table-column-header";
// import { DataTableRowActions } from "./data-table-row-actions";
import { DataTableRowActions } from "../data-table-components/data-table-row-actions";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ColumnMetaType = {
  className?: string;
};

const filterData = (value: any, filterValue: { operator: string; value: any }) => {
  if (!filterValue || typeof filterValue !== 'object' || !filterValue.value) {
    return true; // No filtering
  }

  
  const filterValueString = filterValue.value.toString().toLowerCase();
  const valueString = value.toString().toLowerCase();
  console.log("value----",valueString,filterValueString)

  switch (filterValue.operator) {
    case 'Equals':
      return valueString === filterValueString;

    case 'Does Not Equal':
      return valueString !== filterValueString;

    case 'Begins With':
      return valueString.startsWith(filterValueString);

    case 'Contains':
      return valueString.includes(filterValueString);

      case 'Empty':
        return valueString.trim() === '';
  
      case 'Non Empty':
        return valueString.trim() !== '';
  case 'More Than':
    return parseInt(filterValueString) < parseInt(value)
    case 'Less Than':
      return parseInt(filterValueString) > parseInt(value)

    default:
      return true; 
  }
};

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" /> // for displaying arrows for descending and asc
    ),
    cell: ({ row }) => (
      <div className="w-[150px] capitalize">{row.getValue("id")}</div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate capitalize font-medium">
            {row.getValue("status")}
          </span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      console.log('Email:', { value, filterValue });
      return filterData(value, filterValue); 
    },
},

  {
    accessorKey: "currency",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Currency" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize"> {row.getValue("currency")}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      console.log('Email:', { value, filterValue });
      return filterData(value, filterValue); 
    },
  },
  {
    accessorKey: "date_created",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const dateCreated: any = row.getValue("date_created");
      const formattedDate = new Date(dateCreated).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return (
        <span className="capitalize">{formattedDate}</span>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      console.log('Email:', { value, filterValue });
      return filterData(value, filterValue); 
    },
  },
  {
    accessorKey: "line_items",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Items" />
    ),
    cell: ({ row }) => {
      const type:any  = row.getValue("line_items");
      const lineItems = type?.[0]?.name || null
      const items = lineItems && lineItems.substring(0,10) + "..."
      return (
        <div className="flex w-[100px] items-center">
          <span
          >
            {items}
          </span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      console.log('Email:', { value, filterValue });
      return filterData(value, filterValue); 
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{row.getValue("total")}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      console.log('Email:', { value, filterValue });
      return filterData(value, filterValue); 
    },
  },
  {
    accessorKey: "total_tax",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Tax" />
    ),
    cell: ({ row }) => {
      
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{row.getValue("total_tax")}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      console.log('Email:', { value, filterValue });
      return filterData(value, filterValue); 
    },
  },
  {
    accessorKey: "customer_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{row.getValue("customer_id")}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      console.log('Email:', { value, filterValue });
      return filterData(value, filterValue); 
    },
  },
  {
    accessorKey: "billing",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company" />
    ),
    cell: ({ row }) => {
      const billingData: any = row.getValue("billing");
      const companyName = billingData?.company || null;
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{companyName}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const billingData: any = row.getValue(id);
      const companyName = billingData?.company || "";

      if (typeof value === 'string') {
        // Global search
        return companyName.toLowerCase().includes(value.toLowerCase());
      } else if (typeof value === 'object' && value !== null) {
        // Specific filtering
        return filterData(companyName, value);
      }
      return true; // No filter applied
    },
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const address:any = row.getValue("billing")
      const billingAddress = address?.address_1 || null
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{billingAddress}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const billing:any = row.getValue("billing"); // Access the billing object
      const billingAddress = billing?.address_1 || ""; // Get the nested address value or default to an empty string
      console.log('Billing Address:', { billingAddress, filterValue });
  
      // Use the generic filterData function to handle the filter logic
      return filterData(billingAddress, filterValue);
    },
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    cell: ({ row }) => {
      const city:any = row.getValue("billing")
      const billingCity = city?.city || null
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{billingCity}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const billing:any = row.getValue("billing"); // Access the billing object
      const billingAddress = billing?.city || ""; // Get the nested address value or default to an empty string
  
      // Use the generic filterData function to handle the filter logic
      return filterData(billingAddress, filterValue);
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => {
      const state:any = row.getValue("billing")
      const billingState = state?.state || null
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{billingState}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const billing:any = row.getValue("billing"); // Access the billing object
      const billingAddress = billing?.state || ""; // Get the nested address value or default to an empty string
      console.log('Billing Address:', { billingAddress, filterValue });
  
      // Use the generic filterData function to handle the filter logic
      return filterData(billingAddress, filterValue);
    },
  },
  {
    accessorKey: "post code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Post Code" />
    ),
    cell: ({ row }) => {
      const postcode:any = row.getValue("billing")
      const billingPostcode = postcode?.postcode || null
      
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{billingPostcode}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const billing:any = row.getValue("billing"); // Access the billing object
      const billingAddress = billing?.postcode || ""; // Get the nested address value or default to an empty string
      console.log('Billing Address:', { billingAddress, filterValue });
  
      // Use the generic filterData function to handle the filter logic
      return filterData(billingAddress, filterValue);
    },
  },
  {
    accessorKey: "country",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
    ),
    cell: ({ row }) => {
      const country:any = row.getValue("billing")
      const billingCountry = country?.country || null
      
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{billingCountry}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const billing:any = row.getValue("billing"); // Access the billing object
      const billingAddress = billing?.country || ""; // Get the nested address value or default to an empty string
      console.log('Billing Address:', { billingAddress, filterValue });
  
      // Use the generic filterData function to handle the filter logic
      return filterData(billingAddress, filterValue);
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email:any = row.getValue("billing")
      const billingEmail = email?.email || null
      const subEmail = billingEmail && billingEmail.substring(0,10) + "..."
      
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{subEmail}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const billing:any = row.getValue("billing"); // Access the billing object
      const billingAddress = billing?.email || ""; // Get the nested address value or default to an empty string
      console.log('Billing Address:', { billingAddress, filterValue });
  
      // Use the generic filterData function to handle the filter logic
      return filterData(billingAddress, filterValue);
    },
  },
  {
    accessorKey: "Phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone:any = row.getValue("billing")
      const billingPhone = phone?.phone || null
      
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{billingPhone}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const billing:any = row.getValue("billing"); // Access the billing object
      const billingAddress = billing?.phone || ""; // Get the nested address value or default to an empty string
      console.log('Billing Address:', { billingAddress, filterValue });
  
      // Use the generic filterData function to handle the filter logic
      return filterData(billingAddress, filterValue);
    },
  },
  {
    accessorKey: "Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const name:any = row.getValue("billing")
      const billingName = name?.first_name || null
      const subName = billingName && billingName.substring(0,10)+"..."
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{subName}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const billing:any = row.getValue("billing"); // Access the billing object
      const billingAddress = billing?.first_name || ""; // Get the nested address value or default to an empty string
      console.log('Billing Address:', { billingAddress, filterValue });
  
      // Use the generic filterData function to handle the filter logic
      return filterData(billingAddress, filterValue);
    },
  },
  {
    accessorKey: "payment_method_title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method Title" />
    ),
    cell: ({ row }) => {
      
      return (
        <div className="flex w-[100px] items-center">
          <span className="capitalize">{row.getValue("payment_method_title")}</span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      console.log('Email:', { value, filterValue });
      return filterData(value, filterValue); 
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
    meta: {
        className: "sticky right-0 bg-background"
    } as ColumnMetaType
  }
];

