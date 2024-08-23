"use client";

import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "./account-switcher";
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
import { Nav } from "./nav";
import { type Mail } from "./data";
import { useMail } from "./use-mail";
import { auth } from "@/auth";
import { trace, context } from "@opentelemetry/api";
import { useSession } from "next-auth/react";
import IpAddress from "@/lib/IpAddress";
import { loginLog } from "@/lib/store/actions";
import { connect } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NewMail from "./new-mail";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  loginLog: any;
}

const Mail = ({
  accounts,
  mails,
  defaultLayout = [ 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  loginLog,
}: MailProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();
  const { data: session }: any = useSession();
  const [fetchedMails, setFetchedMails] = React.useState<Mail[]>([]);
  const [loading,setLoading] = React.useState(false)

  React.useEffect(() => {
    fetchMails();
  }, []);

  const fetchMails = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/get-emails');
      const result = await response.json();
      if (response.ok) {
        setLoading(false)
        setFetchedMails(result);
      }
    } catch (error) {
      setLoading(false)
      console.error("Failed to fetch emails:", error);
    }
  };

  console.log("fetchedMails---",fetchedMails)

  React.useEffect(() => {
    const trackPageLoad = async () => {
      const tracer = trace.getTracer("mail--tracer");
      const span = tracer.startSpan("page-load", {
        attributes: {
          description: "Groups Page Viewed",
          user_id: session?.user?.id,
          user_name: session?.user?.name,
          user_email: session?.user?.email,
          event_type: "Mail Page",
          user_ip_address: await IpAddress(),
        },
      });

      context.with(trace.setSpan(context.active(), span), async () => {
        loginLog({
          description: "Mail Page Viewed",
          event_type: "Mail Page",
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
      };
    };
    trackPageLoad();
  }, []);


  const filter = fetchedMails.filter((item:any) => item.uid == mail.selected)
  console.log("filter......",filter)

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <div className="flex items-center px-4 py-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Inbox" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="inbox">Inbox</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="junk">Junk</SelectItem>
                    <SelectItem value="trash">Trash</SelectItem>
                    <SelectItem value="archieve">Archieve</SelectItem>
                    <SelectItem value="settings">Settings</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  New
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="flex-1 overflow-y-auto">
              <MailList items={fetchedMails} loading={loading} />
            </TabsContent>
            <TabsContent value="unread" className="flex-1 h-full overflow-y-auto">
              <MailList loading={loading} items={fetchedMails.filter((item:any) => item.isUnread)} />
            </TabsContent>
          <TabsContent value="new" className="shadow-md h-full">
            <NewMail />
          </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} >
        <MailDisplay
            mail={filter[0]} allMails={fetchedMails}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {
  loginLog,
};

export default connect(mapStateToProps, mapDispatchToProps)(Mail);
