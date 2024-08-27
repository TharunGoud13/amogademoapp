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
// import { Input } from "@/registry/new-york/ui/input"
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { AccountSwitcher } from "@/app/(app)/examples/mail/components/account-switcher"
import { AccountSwitcher } from "./account-switcher";
// import { MailDisplay } from "@/app/(app)/examples/mail/components/mail-display"
import { MailDisplay } from "./mail-display";
import { MailList } from "./mail-list";
// import { MailList } from "@/app/(app)/examples/mail/components/mail-list"
import { Nav } from "./nav";
// import { Nav } from "@/app/(app)/examples/mail/components/nav"
// import { type Mail } from "@/app/(app)/examples/mail/data"
import { type Mail } from "./data";
// import { useMail } from "@/app/(app)/examples/mail/use-mail"
import { useMail } from "./use-mail";
import { auth } from "@/auth";
import { trace, context } from "@opentelemetry/api";
import { useSession } from "next-auth/react";
import IpAddress from "@/lib/IpAddress";
import {
  getAllImapDetails,
  loginLog,
  setUnreadEmail,
} from "@/lib/store/actions";
import { connect } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { GET_EMAILS } from "@/constants/envConfig";
import { toast } from "../ui/use-toast";
import { FaSyncAlt } from "react-icons/fa";
import { Spin } from "antd";

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
  getAllImapDetailsResponse: any;
  getAllImapDetails: any;
  setUnreadEmail: any;
}

const Mail = ({
  accounts,
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  loginLog,
  getAllImapDetails,
  getAllImapDetailsResponse,
  setUnreadEmail,
}: MailProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();
  const [response, setResponse] = React.useState<any>([]);
  const { data: session }: any = useSession();
  const [loading, setLoading] = React.useState(false);

  let imapServerDetails;
  React.useEffect(() => {
    getAllImapDetails();
  }, [getAllImapDetails]);

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
        // Call loginLog action with the relevant data
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
  }, [session, loginLog]);

  const currentEmail = response.filter(
    (item: any) => item.email_id == mail.selected
  );

  const fetchEmails = async () => {
    const headers = new Headers();
    headers.append(
      "Authorization",
      `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    );
    headers.append("Content-Type", "application/json");

    const requestOptions: {} = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    try {
      const response = await fetch(GET_EMAILS, requestOptions);
      const result = await response.json();

      if (response.ok) {
        setResponse(result);
      } else {
        toast({
          description: "Failed to fetch emails",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({ description: "Something went wrong", variant: "destructive" });
    }
  };

  React.useEffect(() => {
    fetchEmails();
  }, []);

  const handleSync = async () => {
    try {
      setLoading(true);
      await getAllImapDetails();

      console.log("session----", session?.user?.email);
      console.log("getAllImapDetailsResponse---", getAllImapDetailsResponse);
      const currentUserImapDetails = getAllImapDetailsResponse.filter(
        (item: any) => item.user_email == session?.user?.email
      );
      imapServerDetails = {
        user: currentUserImapDetails[0].data_response.split(" ")[0],
        password: currentUserImapDetails[0].data_response.split(" ")[1],
        host: currentUserImapDetails[0].data_response.split(" ")[2],
        port: currentUserImapDetails[0].data_response.split(" ")[3],
        tls: currentUserImapDetails[0].data_response.split(" ")[4],
      };
      console.log("imtp server details", imapServerDetails);
      const response = await fetch("/api/get-emails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-IMAP-Config": JSON.stringify(imapServerDetails),
        },
      });

      const result = await response.json();
      console.log("result.......", result);
      const filterUnreadEmail = result.filter(
        (item: any) => item.isUnread === true
      );
      console.log("filterUnreadEmail", filterUnreadEmail);
      await setUnreadEmail(filterUnreadEmail);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await fetchEmails();
    } catch (error) {
      toast({ description: "Failed to sync emails", variant: "destructive" });
      console.log("error---", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full  items-stretch"
      >
        <ResizablePanel minSize={65}>
          <Tabs defaultValue="all">
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
                    <SelectItem value="archive">Archive</SelectItem>
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
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="flex  items-center space-x-2 relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                    <FaSyncAlt className="h-5 w-5" onClick={handleSync} />
                  </div>
                  <Input type="text" placeholder="Search..." />
                </div>
              </form>
            </div>
            {loading && (
              <div className="flex justify-center items-center gap-2.5">
                <Spin /> <span className="font-md text-lg">Syncing emails...</span>
              </div>
            )}
            <TabsContent value="all" className="m-0">
              <MailList items={response} />
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList items={response.filter((item:any) => !item.read)} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel minSize={30}>
          <MailDisplay mail={currentEmail[0]} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
};

const mapStateToProps = (state: any) => ({
  getAllImapDetailsResponse: state.getAllImapDetailsResponse,
});

const mapDispatchToProps = {
  loginLog,
  getAllImapDetails,
  setUnreadEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(Mail);
