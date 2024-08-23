"use client"
import { ComponentProps, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// import { Mail } from "@/app/(app)/examples/mail/data"
import { Mail } from "./data";
import { useMail } from "./use-mail";
import { toast } from "../ui/use-toast";
import { Spin } from "antd";
import { Skeleton } from "../ui/skeleton";
// import { useMail } from "@/app/(app)/examples/mail/use-mail"

interface MailListProps {
  items: Mail[];
  loading:boolean
}

export async function fetchMails() {
  const response = await fetch('/api/get-emails');
  const result = await response.json();
  return result
}

export function MailList({ items,loading }: MailListProps) {
  const [mail, setMail] = useMail();


  if (loading) {
    return (
        <div className="flex flex-col gap-2.5 my-2.5 mr-2.5 mx-2.5 h-fit w-[96%]">
            {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border p-2.5 transition ease-in-out delay-150 rounded-lg">
                    <div className="flex gap-4 items-center">
                        <Skeleton className="w-12 h-12 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="space-y-2 text-muted-foreground pt-2.5">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
            ))}

        </div>
    )
}
  return (
    <ScrollArea className="h-full">
      {loading && <Spin/>}
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items && items?.length > 0 && items.map((item:any,index) => (
          <button
            key={index}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item && "bg-muted"
            )}
            onClick={() => {
              console.log("item-----",item)
              setMail({
                ...mail,
                selected: item.uid,
              })}
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.from}</div>
                  {item.isUnread && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {/* {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })} */}
                  {formatDistanceToNow(new Date(item.date))}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
            {item.text}
            </div>
            {/* {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label:any) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null} */}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
