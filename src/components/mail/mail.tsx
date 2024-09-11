"use client";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import  {MailList}  from "@/components/mail/mail-list";
// import { useMail } from "@/components/mail/use-mail";
import { trace, context } from "@opentelemetry/api";
import { useSession } from "next-auth/react";
import IpAddress from "@/lib/IpAddress";
import {
  getAllImapDetails,
  loginLog,
  setUnreadEmail,
} from "@/lib/store/actions";
import { connect } from "react-redux";
import { GET_EMAILS } from "@/constants/envConfig";
import { toast } from "@/components/ui/use-toast";
import { FaSyncAlt } from "react-icons/fa";
import { Spin } from "antd";
import { Skeleton } from "../ui/skeleton";

interface MailProps {
  loginLog: any;
  getAllImapDetailsResponse: any;
  getAllImapDetails: any;
  setUnreadEmail: any;
  getAllImapDetailsLoading: any;
}

const Mail: React.FC<MailProps> = ({
  loginLog,
  getAllImapDetails,
  getAllImapDetailsResponse,
  setUnreadEmail,
  getAllImapDetailsLoading,
}) => {
  // const [mail, setMail] = useMail();
  const [responseEmail, setResponse] = React.useState<any>([]); // email list data
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
      await fetchEmails();
      setLoading(true);
      await getAllImapDetails();

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
      const response = await fetch("/api/get-emails", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-IMAP-Config": JSON.stringify(imapServerDetails),
        },
      });

      const result = await response.json();
      const filterUnreadEmail = result.filter(
        (item: any) => item.isUnread === true
      );

      // Filter out emails that have already been processed
      const newUnreadEmails = filterUnreadEmail.filter((email: any) => {
        return !responseEmail.some(
          (existingEmail: any) => existingEmail.email_uid == email.uid
        );
      });

      if (newUnreadEmails.length > 0) {
        await setUnreadEmail(newUnreadEmails);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await fetchEmails();
      } else {
        console.log("No new unread emails to sync");
      }
    } catch (error) {
      toast({ description: "Failed to sync emails", variant: "destructive" });
      console.log("error---", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex w-full flex-col md:flex-row">
      <div className="w-full">
        <div>
          <Separator />
          <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <form>
              <div className="flex  items-center space-x-2 relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer">
                  <FaSyncAlt className="h-5 w-5" onClick={handleSync} />
                </div>
                <Input
                  type="text"
                  className="focus:!ring-offset-0 focus:!ring-0"
                  placeholder="Search..."
                />
              </div>
            </form>
          </div>
          {loading && (
            <div className="flex justify-center items-center gap-2.5">
              <Spin />{" "}
              <span className="font-md text-lg">Syncing emails...</span>
            </div>
          )}
          {getAllImapDetailsLoading && (
            <div className="flex flex-col items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="border  p-2.5 w-[98%] rounded-lg my-2.5 !mx-4 ">   
                        <div className="space-y-2 text-muted-foreground pt-2.5">
                            <Skeleton className="h-4 w-[40%]" />
                            <Skeleton className="h-4 w-[80%]" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </div>
          )}
          <MailList
            items={responseEmail.filter((item: any) => item.status != "sent" && item.is_draft != true)}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  getAllImapDetailsResponse: state.getAllImapDetailsResponse,
  getAllImapDetailsLoading: state.getAllImapDetailsLoading,
});

const mapDispatchToProps = {
  loginLog,
  getAllImapDetails,
  setUnreadEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(Mail);
