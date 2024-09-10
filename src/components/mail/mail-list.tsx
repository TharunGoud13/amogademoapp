import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// import { Mail } from "@/app/(app)/examples/mail/data"
// import { Mail } from "./data";
// import { useMail } from "./use-mail";
import Link from "next/link";
import { useSession } from "next-auth/react";
// import { useMail } from "@/app/(app)/examples/mail/use-mail"

interface MailListProps {
  items: any
}

export function MailList({ items }: MailListProps) {
  console.log("items----",items)
  const {data:session} = useSession()

  const filteredItems = items && items.filter((item:any) => (item.recipient_emails == session?.user?.email) || (item.sender_email == session?.user?.email));
  const sortedItems = filteredItems && filteredItems?.sort((a:any,b:any) => new Date(b.created_datetime).getTime() - new Date(a.created_datetime).getTime())
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {sortedItems?.length > 0 ?
        sortedItems.map((item:any) => (
          <Link
          href={`/email/${item.email_id}`}
            key={item.email_id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              
            )}
            >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* <div className="font-semibold">
                    <p>{item.sender_name}</p></div> */}
                  <div className="font-semibold">
                    <p>{item.sender_email}</p></div>
                  {!item.isUnread && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  >
                  {formatDistanceToNow(new Date(item.created_datetime), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.body}
            </div>
          </Link>
        )): 
        <div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-24 w-24 text-muted" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Your inbox is empty</h2>
        <p className="mt-2 text-muted-foreground">
          There are no new emails at the moment. Check back later for updates.
        </p>
      </div>
    </div>}
      </div>
    </ScrollArea>
  );
}

