import React, { useState, useRef, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  User,
  Eye,
  FileText,
  Share2,
  MessageCircle,
  Mail,
  Clipboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Event = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  color: string;
  location?: string;
  description?: string;
};

const statusColors: { [key: string]: string } = {
    cancelled: "bg-red-500",
    completed: "bg-green-500",
    processing: "bg-blue-500",
    pending: "bg-violet-500"
}

// on click of an event display a card with that event details
function transformOrderToEvent(order: any): Event {
    const startDate = new Date(order.date_created)
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 1) 
  
    return {
      id: order.id,
      title: `Order #${order.id}`,
      start: startDate,
      end: endDate,
      color: statusColors[order.status] || "bg-gray-500",
      description: `Status: ${order.status} \n Total: ${order.currency_symbol}${order.total}\nItems: ${order.line_items.map((item:any) => `${item.quantity}x ${item.name}`).join(", ")}`
    }
  }

export default function CalendarView({ data }: { data: Event[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const weekViewRef = useRef<HTMLDivElement>(null);
  const events = useMemo(() => data.map(transformOrderToEvent), [data])
  const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToPreviousWeek = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7
      )
    );
  };

  const goToNextWeek = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 7
      )
    );
  };

  const goToPreviousDay = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 1
      )
    );
  };

  const goToNextDay = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 1
      )
    );
  };

  const handleMonthChange = (month: string) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), months.indexOf(month), 1)
    );
  };

  const handleYearChange = (year: string) => {
    setCurrentDate(new Date(parseInt(year), currentDate.getMonth(), 1));
  };

  const renderEventPopover = (event: Event) => (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer`}
          onClick={(e) => e.stopPropagation()}
        >
          {event.title}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{event.title}</h4>
            <p className="text-sm text-muted-foreground">
              {event.start.toDateString()}
            </p>
          </div>
          {event.description && (
            <div className="flex items-center gap-2">
              <span className="text-sm">{event.description}</span>
            </div>
          )}
          <div className="flex justify-between">
            <Button variant="ghost" size="icon" title="View">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="PDF">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Share">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Chat">
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Email">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Task">
              <Clipboard className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const renderMonthView = () => {
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

    const days = [];
    for (let i = firstDayOfMonth; i > 0; i--) {
      days.push({ date: daysInPrevMonth - i + 1, isPrevMonth: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: i, isNextMonth: true });
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4 md:mr-1" />
            <span className="hidden md:block">Previous</span>
          </Button>
          <h2 className="text-lg font-semibold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={goToNextMonth}
          >
            <span className="hidden md:block">Next</span>
            <ChevronRight className="h-4 w-4 md:ml-1" />
          </Button>
        </div>
        <div className="grid p-2.5 border border-secondary grid-cols-7 gap-1">
          {weekdays.map((day) => (
            <div
              key={day}
              className="text-center font-medium text-primary py-2"
            >
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            const dayDate = new Date(
              currentDate.getFullYear(),
              day.isPrevMonth
                ? currentDate.getMonth() - 1
                : day.isNextMonth
                ? currentDate.getMonth() + 1
                : currentDate.getMonth(),
              day.date
            );
            const dayEvents = events.filter(
              (event) =>
                event.start.getDate() === dayDate.getDate() &&
                event.start.getMonth() === dayDate.getMonth() &&
                event.start.getFullYear() === dayDate.getFullYear()
            );

            return (
              <div
                key={index}
                className={`p-1 border ${
                  day.isCurrentMonth ? "bg-white" : "bg-gray-100 text-gray-400"
                } ${
                  isToday(dayDate) ? "!bg-blue-100 border-blue-500 border-2" : ""
                } h-24 overflow-hidden`}
              >
                <span className={`block text-sm mb-1 ${isToday(dayDate) ? "font-bold text-blue-600" : ""}`}>
                  {day.date}
                </span>
                <div className="space-y-1">
                  {dayEvents.map((event) => renderEventPopover(event))}
                </div>
              </div>
            );
          })}
          </div>
        </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      return day;
    });

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={goToPreviousWeek}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <h2 className="text-lg font-semibold">
            {weekStart.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}{" "}
            -
            {weekDays[6].toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={goToNextWeek}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="relative">
          <div ref={weekViewRef} className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-1" style={{ width: "200%" }}>
              <div className="sticky left-0  z-10"></div>
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className="text-center font-medium text-gray-500 py-2"
                >
                  {weekdays[day.getDay()]}
                  <div className="text-sm">{day.getDate()}</div>
                </div>
              ))}
              {Array.from({ length: 24 }).map((_, hour) => (
                <React.Fragment key={hour}>
                  <div className="sticky left-0 z-10 text-right pr-2 text-sm text-gray-500">
                    {hour === 0
                      ? "12 AM"
                      : hour < 12
                      ? `${hour} AM`
                      : hour === 12
                      ? "12 PM"
                      : `${hour - 12} PM`}
                  </div>
                  {weekDays.map((day, dayIndex) => (
                    <div
                      key={`${hour}-${dayIndex}`}
                      className="border-t relative min-h-[48px]"
                    >
                      {events
                        .filter(
                          (event) =>
                            event.start.getDate() === day.getDate() &&
                            event.start.getMonth() === day.getMonth() &&
                            event.start.getFullYear() === day.getFullYear() &&
                            event.start.getHours() === hour
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            className="absolute w-[calc(100%-8px)]"
                            style={{
                              top: `${(event.start.getMinutes() / 60) * 100}%`,
                              height: `${
                                ((event.end.getTime() - event.start.getTime()) /
                                  (1000 * 60 * 60)) *
                                100
                              }%`,
                            }}
                          >
                            {renderEventPopover(event)}
                          </div>
                        ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayStart = new Date(currentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);

    const dayEvents = data.filter(
      (event) => event.start >= dayStart && event.start <= dayEnd
    );

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={goToPreviousDay}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <h2 className="text-lg font-semibold">
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={goToNextDay}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="flex-grow overflow-y-auto h-[calc(100vh-250px)]">
          
          {Array.from({ length: 24 }).map((_, hour) => {
            const hourStart = new Date(dayStart);
            hourStart.setHours(hour);
            const hourEnd = new Date(hourStart);
            hourEnd.setHours(hour + 1);

            const hourEvents = dayEvents.filter(
              (event) => event.start < hourEnd && event.end > hourStart
            );

            return (
              <div key={hour} className="flex min-h-[60px] group">
                <div className="w-16 py-2 text-right pr-2 text-sm text-gray-500 group-hover:font-semibold">
                  {hour === 0
                    ? "12 AM"
                    : hour < 12
                    ? `${hour} AM`
                    : hour === 12
                    ? "12 PM"
                    : `${hour - 12} PM`}
                </div>
                <div className="flex-grow border-t relative">
                  {hourEvents.map((event) => {
                    const eventStart =
                      event.start < hourStart ? hourStart : event.start;
                    const eventEnd = event.end > hourEnd ? hourEnd : event.end;
                    const startPercentage =
                      ((eventStart.getTime() - hourStart.getTime()) /
                        (60 * 60 * 1000)) *
                      100;
                    const durationPercentage =
                      ((eventEnd.getTime() - eventStart.getTime()) /
                        (60 * 60 * 1000)) *
                      100;

                    return (
                      <div
                        key={event.id}
                        className="absolute left-0 right-0"
                        style={{
                          top: `${startPercentage}%`,
                          height: `${durationPercentage}%`,
                        }}
                      >
                        {renderEventPopover(event)}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-wrap space-y-2 md:space-y-0 justify-between items-center mb-4">
        <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
          Today
        </Button>
        <div className="flex items-center space-x-2">
          <Select
            value={months[currentDate.getMonth()]}
            onValueChange={handleMonthChange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={currentDate.getFullYear().toString()}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                { length: 10 },
                (_, i) => currentDate.getFullYear() - 5 + i
              ).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          
          <Select
            value={view}
            onValueChange={(value: "month" | "week" | "day") => setView(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
      </div>
      <div className="overflow-x-auto">
        {view === "month"
          ? renderMonthView()
          : view === "week"
          ? renderWeekView()
          : renderDayView()}
      </div>
    </div>
  );
}
