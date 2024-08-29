import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
// import { Mail } from "@/app/(app)/examples/mail/data"
import { Mail } from "./data";
import { useMail } from "./use-mail";
// import { useMail } from "@/app/(app)/examples/mail/use-mail"

interface MailListProps {
  items: Mail[];
}

export function MailList({ items }: MailListProps) {
  const [mail, setMail] = useMail();

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items?.length > 0 ?
        items.map((item:any) => (
          <button
            key={item.email_id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.email_id && "bg-muted"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.email_id,
              })
            }
            >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.sender_name}</div>
                  {!item.isUnread && (
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
                  {formatDistanceToNow(new Date(item.created_datetime), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.description}
            </div>
          </button>
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
