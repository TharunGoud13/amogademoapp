"use client"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { DateRange } from "react-day-picker"
import { addDays, format } from "date-fns"
import { Calendar } from "./ui/calendar"
const buttonClass = "h-8 border border shadow-sm  transition-colors"


export const CalendarDatePicker = ({date,onDateSelect}:any) => {
  
  return(
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              buttonClass,
              "w-[280px] justify-start text-left font-normal",
              !date && ""
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}