"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
// import { DataTableViewOptions } from "@/app/(app)/examples/tasks/components/data-table-view-options"
// import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableViewOptions } from "./bom-table-view-options"
import { DataTableFacetedFilter } from "./bom-table-faceted-filter"

// import { priorities, statuses } from "../data/data"
import { priorities,statuses } from "@/constants/taskdata"
import { FC, useState } from "react"
import { bomRaw } from "@/lib/store/actions"
import { connect } from "react-redux"
// import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}



const  DataTableToolbar:FC<any> = ({
  table,bomRaw
}) => {
  const [searchValue,setSearchValue] = useState("")
  const isFiltered = table.getState().columnFilters.length > 0

  const handleSearch = (event:any) => {
    if(event.key === "Enter") {
      bomRaw(searchValue)
      console.log("value---",searchValue)
  }
}

  return (
    <div className="flex  items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Part Name..."
          onChange={(event) =>
            setSearchValue(event.target.value)
          }
          onKeyPress={(e) => handleSearch(e)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )} */}
        {/* {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {
  bomRaw
}
export default connect(mapStateToProps,mapDispatchToProps)(DataTableToolbar);
