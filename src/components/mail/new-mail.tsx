"use client";
import { FC, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import {
  CREATE_EMAIL_ATTACHMENT_URL,
  GET_CONTACTS_API,
  GET_EMAILS,
} from "@/constants/envConfig";
import { Badge } from "../ui/badge";
import {
  BoldIcon,
  RedoIcon,
  ItalicIcon,
  Paperclip,
  UnderlineIcon,
  X,
  Undo2,
  Calendar,
  ArchiveX,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  Flag,
  Clipboard,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import { getAllImapDetails } from "@/lib/store/actions";
import { connect } from "react-redux";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface NewMailProps {
  getAllImapDetailsResponse: any;
  getAllImapDetails: any;
  response: any;
}

const NewMail: FC<NewMailProps> = ({
  getAllImapDetailsResponse,
  getAllImapDetails,
  response,
}) => {
  const [to, setTo] = useState<string[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [toInput, setToInput] = useState("");
  const [ccInput, setCcInput] = useState("");
  const [bccInput, setBccInput] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [activeSuggestionField, setActiveSuggestionField] = useState<
    string | null
  >(null);
  const uploadFileRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getAllImapDetails();
  }, [getAllImapDetails]);

  const mailResponse = response && response.length > 0 && response[0];
  useEffect(() => {
    if (mailResponse) {
      setTo([mailResponse?.sender_email]);
      setSubject(mailResponse?.subject);
      setMessage(mailResponse?.description);
      setCc([mailResponse?.cc_emails]);
      setBcc([mailResponse?.bcc_emails]);
    }
  }, [mailResponse]);
  console.log("mailResponse", mailResponse);

  const imapDetailsResponse = getAllImapDetailsResponse.filter(
    (item: any) => item.user_email == session?.user?.email
  );
  const fetchUsers = async (query: string) => {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const requestOptions: any = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    try {
      const response = await fetch(
        `${GET_CONTACTS_API}?user_email=ilike.*${query}*`,
        requestOptions
      );
      const result = await response.json();
      setSuggestions(result);
    } catch (error) {
      toast({ description: "Error fetching users", variant: "destructive" });
    }
  };

  
  // Handle input changes for To, Cc, Bcc fields
  const handleInputChange = (e: any, field: string) => {
    const value = e.target.value;
    if (field === "to") {
      setToInput(value);
      setActiveSuggestionField("to");
    } else if (field === "cc") {
      setCcInput(value);
      setActiveSuggestionField("cc");
    } else if (field === "bcc") {
      setBccInput(value);
      setActiveSuggestionField("bcc");
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      if (value.length >= 1) {
        fetchUsers(value);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: any) => {
    if (activeSuggestionField === "to") {
      setTo((prev) => [...prev, suggestion.user_email]);
      setToInput("");
    } else if (activeSuggestionField === "cc") {
      setCc((prev) => [...prev, suggestion.user_email]);
      setCcInput("");
    } else if (activeSuggestionField === "bcc") {
      setBcc((prev) => [...prev, suggestion.user_email]);
      setBccInput("");
    }
    setSuggestions([]);
    setActiveSuggestionField(null);
  };

  const handleRemoveRecipient = (field: string, index: number) => {
    if (field === "to") {
      setTo((prev) => prev.filter((_, i) => i !== index));
    } else if (field === "cc") {
      setCc((prev) => prev.filter((_, i) => i !== index));
    } else if (field === "bcc") {
      setBcc((prev) => prev.filter((_, i) => i !== index));
    }
  };
  let user: any = session?.user;

  const handleSendMail = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({
          user: session?.user,
          to: to.join(", "),
          cc: cc.join(", "),
          bcc: bcc.join(", "),
          subject,
          message,
          username: imapDetailsResponse[0]?.data_response?.split(" ")[0],
          password: imapDetailsResponse[0]?.data_response?.split(" ")[1],
        }),
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("/api/send-email", requestOptions);
      if (!response.ok) {
        toast({ description: "Error sending email", variant: "destructive" });
      }
      if (attachment) {
        await sendEmailAttachment();
      }
      const emailHeaders = new Headers();
      emailHeaders.append("Content-Type", "application/json");
      emailHeaders.append(
        "Authorization",
        `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
      );
      const emailRequestOptions = {
        method: "POST",
        body: JSON.stringify({
          status: "sent",
          subject: message,
          sender_email: user?.email,
          recipient_emails: to.join(", "),
          sender_name: user?.name,
          sender_mobile: user?.mobile,
          business_name: user?.business_name,
          business_number: user?.business_number,
          created_datetime: new Date().toUTCString(),
          cc_emails: cc.join(", "),
          bcc_emails: bcc.join(", "),
        }),
        headers: emailHeaders,
      };
      const sendEmail = await fetch(GET_EMAILS, emailRequestOptions);
      if (!sendEmail.ok) {
        toast({ description: "Something went wrong", variant: "destructive" });
      }
      toast({ description: "Email sent successfully", variant: "default" });
      setTo([]);
      setCc([]);
      setBcc([]);
      setLoading(false);
      setSubject("");
      setMessage("");
      setAttachment(null);
    } catch (error) {
      toast({ description: "Failed to send email", variant: "destructive" });
      setLoading(false);
    }
  };

  const handleClick = () => {
    uploadFileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const sendEmailAttachment = async () => {
    if (!attachment) return;
    const currentData = new Date().toUTCString();

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    );

    const reader = new FileReader();
    reader.onload = async (event) => {
      const binaryString = event?.target?.result;
      if (typeof binaryString !== "string") return;
      const base64String = btoa(binaryString);
      const requestOptions: any = {
        method: "POST",
        body: JSON.stringify({
          email_id: session?.user?.id,
          file_name: attachment.name,
          content_type: attachment.type,
          file_size: attachment.size,
          email_file: base64String,
          created_datetime: currentData,
        }),
        headers: headers,
      };
      try {
        const response = await fetch(
          CREATE_EMAIL_ATTACHMENT_URL,
          requestOptions
        );
        if (!response.ok) {
          throw new Error("Failed to send email attachment");
        }
      } catch (error) {
        toast({
          description: "Failed to send email attachment",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(attachment);
  };

  const formattedDate = new Date(mailResponse && mailResponse.created_datetime);

  return (
    <form onSubmit={handleSendMail}>
      <Card className="p-2.5 my-2.5 flex flex-col w-[99%]  gap-5 m-2.5">
        {mailResponse && (
          <h1 className="mt-2 text-gray-500">
            Date: {formattedDate.toLocaleString()}
          </h1>
        )}
        <div className="flex flex-col border">
          <div className="flex  items-center">
            <span className="text-gray-500 pl-2.5 pr-4">
              {mailResponse?.sender_email ? "From" : "To"}
            </span>

            {to.map((recipient, index) => (
              <Badge key={index} className="flex items-center m-1 p-1 rounded">
                {recipient}
                {!mailResponse && (
                  <X
                    className="ml-1 cursor-pointer"
                    size={12}
                    onClick={() => handleRemoveRecipient("to", index)}
                  />
                )}
              </Badge>
            ))}
            <Input
              className="!border-0 focus:!ring-offset-0 focus:!ring-0 focus:!ring-opacity-0 focus:!border-0"
              value={toInput}
              disabled={mailResponse}
              type="email"
              onChange={(e) => handleInputChange(e, "to")}
            />
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 pl-2.5 pr-4">Cc</span>
            {cc.map(
              (recipient, index) =>
                mailResponse.cc_emails && (
                  <Badge
                    key={index}
                    className="flex items-center m-1 p-1 rounded"
                  >
                    {recipient}
                    {!mailResponse && (
                      <X
                        className="ml-1 cursor-pointer"
                        size={12}
                        onClick={() => handleRemoveRecipient("cc", index)}
                      />
                    )}
                  </Badge>
                )
            )}
            <Input
              disabled={mailResponse}
              className="!border-0 focus:!ring-offset-0 focus:!ring-0 focus:!ring-opacity-0 focus:!border-0"
              value={ccInput}
              type="email"
              onChange={(e) => handleInputChange(e, "cc")}
            />
          </div>
          <div className="flex  items-center">
            <span className="text-gray-500 pl-2.5 pr-4">Bcc</span>
            {bcc.map(
              (recipient, index) =>
                mailResponse?.bcc_emails && (
                  <Badge
                    key={index}
                    className="flex items-center m-1  p-1 rounded"
                  >
                    {recipient}
                    {!mailResponse && (
                      <X
                        className="ml-1 cursor-pointer"
                        size={12}
                        onClick={() => handleRemoveRecipient("bcc", index)}
                      />
                    )}
                  </Badge>
                )
            )}
            <Input
              className="!border-0 focus:!ring-offset-0 focus:!ring-0 focus:!ring-opacity-0 focus:!border-0"
              value={bccInput}
              type="email"
              onChange={(e) => handleInputChange(e, "bcc")}
            />
          </div>
          {suggestions.length > 0 && activeSuggestionField && (
            <Card className="relative md:left-2 md:bottom-2 md:w-[50%] w-full  border border-gray-300 z-10">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.user_email}
                </div>
              ))}
            </Card>
          )}
        </div>
        <Input
          type="text"
          value={subject}
          disabled={mailResponse}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
        />
        <div className="flex items-center space-x-2 gap-2.5 cursor-pointer border-b pb-2 mb-4">
          <Undo2 onClick={() => setMessage("")} />
          <BoldIcon
            className={`h-7 w-5 ${
              bold && "bg-gray-200 border dark:bg-black border-gray-400"
            }   rounded`}
            onClick={() => setBold(!bold)}
          />
          <ItalicIcon
            className={`h-7 w-5 ${
              italic && "bg-gray-200 border dark:bg-black border-gray-400"
            }   rounded`}
            onClick={() => setItalic(!italic)}
          />
          <UnderlineIcon
            className={`h-7 w-5 ${
              underline && "bg-gray-200 border dark:bg-black border-gray-400"
            }   rounded`}
            onClick={() => setUnderline(!underline)}
          />
        </div>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          className={`resize-none ${bold && "font-bold"} ${
            italic && "italic"
          } ${underline && "underline"}`}
          rows={14}
          disabled={mailResponse}
        />
        <div className="flex ml-3 justify-between items-center">
          {mailResponse ? (
            <div className="flex items-center gap-5">
              <Reply className="h-5 w-5  cursor-pointer" />
              <ReplyAll className="h-5 w-5 cursor-pointer" />
              <Forward className="h-5 w-5 cursor-pointer" />
              <Flag className="h-5 w-5 cursor-pointer" />
              <Clipboard className="h-5 w-5 cursor-pointer" />
              <MessageCircle className="h-5 w-5 cursor-pointer" />
              <MoreVertical className="h-5 w-5 cursor-pointer" />
            </div>
          ) : (
            <>
              <Button
                type="submit"
                disabled={loading || !(to && subject && message)}
              >
                {loading ? "Sending..." : "Send"}
              </Button>

              <div className="flex items-center">
                {attachment && (
                  <Badge className="mr-2">
                    {attachment.name}
                    <X
                      className="ml-1 cursor-pointer"
                      size={12}
                      onClick={() => setAttachment(null)}
                    />
                  </Badge>
                )}
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={uploadFileRef}
                />
                <Paperclip
                  onClick={handleClick}
                  className="text-3xl cursor-pointer"
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </form>
  );
};

const mapStateToProps = (state: any) => ({
  getAllImapDetailsResponse: state.getAllImapDetailsResponse,
});

const mapDispatchToProps = {
  getAllImapDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewMail);
