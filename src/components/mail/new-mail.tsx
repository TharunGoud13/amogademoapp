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
  ItalicIcon,
  Paperclip,
  UnderlineIcon,
  X,
  Undo2,
  Reply,
  ReplyAll,
  Forward,
  Flag,
  Clipboard,
  MessageCircle,
  MoreVertical,
  Star,
} from "lucide-react";
import { getAllImapDetails } from "@/lib/store/actions";
import { connect } from "react-redux";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
  const [to, setTo] = useState<string[]>([]); // capture entered to text
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [toInput, setToInput] = useState(""); // click on suggestion
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
  const [recipientMobile, setRecipientMobile] = useState<string>("");
  const [isReply, setIsReply] = useState(false);
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const [isImportant, setIsImportant] = useState(false);
  const [originalMailData, setOriginalMailData] = useState<any>(null);

  // used for getting imap details which user created on profile page
  useEffect(() => {
    getAllImapDetails();
  }, [getAllImapDetails]);

  // mailResponse is to get data of a email which is clicked
  const mailResponse = response && response.length > 0 && response[0];
  // draftResponse is used to filter data which has is_draft as true so we here we only get draft emails
  const draftResponse =
    response && response.filter((item: any) => item.is_draft == true && item);
  const draftEmail = draftResponse && draftResponse[0];

  // on page load if mailResponse has some data then we are setting it to fields so that data will be prefilled
  useEffect(() => {
    if (mailResponse) {
      const initialData = {
        to: [mailResponse?.sender_email],
        subject: mailResponse?.subject,
        message: mailResponse?.body,
        cc: mailResponse?.cc_emails ? [mailResponse.cc_emails] : [],
        bcc: mailResponse?.bcc_emails ? [mailResponse.bcc_emails] : [],
      };
      setOriginalMailData(initialData);
      
      if (!isReply) {
        setTo(initialData.to);
        setSubject(initialData.subject);
        setMessage(initialData.message);
        setCc(initialData.cc);
        setBcc(initialData.bcc);
      }
    }
  }, [mailResponse, isReply]);

  // getting imap details of current logged in user
  const imapDetailsResponse = getAllImapDetailsResponse.filter(
    (item: any) => item.user_email == session?.user?.email
  );

  // get users from user_catalog api to get users based on text we search
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
      setRecipientMobile(suggestion?.user_mobile);
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

  // payload to send email
  const baseEmailData = {
    status: "sent",
    subject: subject,
    body: message,
    sender_email: user?.email,
    recipient_emails: to.join(", "),
    full_name: user?.name,
    sender_name: user?.name,
    sender_mobile: user?.mobile,
    business_name: user?.business_name,
    business_number: user?.business_number,
    created_datetime: new Date().toUTCString(),
    is_read: "No",
    from_business_number: user?.business_number,
    from_business_name: user?.business_name,
    created_user: user?.name,
    created_userid: user?.id,
    recipient_mobiles: recipientMobile,
    cc_emails: cc.join(", "),
    bcc_emails: bcc.join(", "),
    is_starred: false,
    is_important: false,
    is_draft: false,
    is_deleted: false,
    for_email_id:
      isReply && mailResponse?.email_id ? mailResponse.email_id : "null",
    for_email:
      isReply && mailResponse?.sender_email
        ? mailResponse.sender_email
        : "null",
  };

  // when clicked on Send button we are sending it to webmail using nodemailer and to email API
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

      let emailData: any = {
        ...baseEmailData,
        is_draft: false,
      };

      if (draftEmail && Object.keys(draftEmail).length > 0) {
        // Include email_id only for draft emails
        emailData = {
          ...emailData,
          email_id: draftEmail.email_id,
        };
        await updateEmailData(emailData);
      } else {
        // Send as new email
        await sendEmailData(emailData);
        for (const ccEmail of cc) {
          if (ccEmail) {
            await sendEmailData({
              ...baseEmailData,
              recipient_emails: ccEmail,
            });
          }
        }

        // Send separate emails for BCC recipients
        for (const bccEmail of bcc) {
          if (bccEmail) {
            await sendEmailData({
              ...baseEmailData,
              recipient_emails: bccEmail,
            });
          }
        }
      }

      setLoading(false);
      toast({ description: "Email sent successfully", variant: "default" });
      resetForm();
    } catch (error) {
      toast({ description: "Failed to send email", variant: "destructive" });
      setLoading(false);
      setIsReply(false);
    }
  };

  const sendEmailData = async (emailData: any) => {
    const emailHeaders = new Headers();
    emailHeaders.append("Content-Type", "application/json");
    emailHeaders.append(
      "Authorization",
      `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const emailRequestOptions = {
      method: "POST",
      body: JSON.stringify(emailData),
      headers: emailHeaders,
    };
    const sendEmail = await fetch(GET_EMAILS, emailRequestOptions);
    if (!sendEmail.ok) {
      toast({ description: "Error sending email", variant: "destructive" });
    }
  };

  const updateEmailData = async (emailData: any) => {
    const emailHeaders = new Headers();
    emailHeaders.append("Content-Type", "application/json");
    emailHeaders.append(
      "Authorization",
      `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    );
    const emailRequestOptions = {
      method: "PUT",
      body: JSON.stringify(emailData),
      headers: emailHeaders,
    };
    const updateEmail = await fetch(
      `${GET_EMAILS}?email_id=eq.${emailData?.email_id}`,
      emailRequestOptions
    );
    if (!updateEmail.ok) {
      toast({ description: "Error updating email", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setTo([]);
    setCc([]);
    setBcc([]);
    setSubject("");
    setMessage("");
    setAttachment(null);
    setIsReply(false);
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

  const handleReplyClick = () => {
    setIsReply(true);
    if (originalMailData) {
      setTo([originalMailData.to]);
      setSubject('');
      setMessage(''); 
      setCc([]); 
      setBcc([]);
    }
  };

  const handleReplyAllClick = () => {
    setIsReply(true);
    if (originalMailData) {
      setTo(originalMailData.to); 
      setSubject('');
      setMessage(''); 
      setCc(originalMailData?.cc); 
      setBcc(originalMailData?.bcc); 
    }
  }

  const handleForwardClick = () => {
    setIsReply(true);
    if (originalMailData) {
      setTo([]);
      setSubject(originalMailData.subject);
      setMessage(originalMailData.message);
      setCc([]);
      setBcc([]);
    }
  }

  const handleCancelReply = () => {
    setIsReply(false);
    // Reset the form to its original state
    if (originalMailData) {
      setTo(originalMailData.to);
      setSubject(originalMailData.subject);
      setMessage(originalMailData.message);
      setCc(originalMailData.cc);
      setBcc(originalMailData.bcc);
    }
  };

  const handleDraft = async () => {
    setIsDraftLoading(true);
    const draftEmailData = {
      ...baseEmailData,
      is_draft: true,
    };
    try {
      await sendEmailData(draftEmailData);
      toast({ description: "Draft Saved Successfully", variant: "default" });
      setIsDraftLoading(false);
      resetForm();
    } catch (error) {
      toast({ description: "Failed to save draft", variant: "destructive" });
      resetForm();
      setIsDraftLoading(false);
    }
  };

  useEffect(() => {
    if (mailResponse) {
      setIsImportant(mailResponse.is_important);
    }
  }, [mailResponse]);

  const handleImportant = async () => {
    const updatedImportance = !isImportant;
    setIsImportant(updatedImportance);
    const importantEmailData = {
      ...mailResponse,
      is_important: updatedImportance,
    };
    try {
      await updateEmailData(importantEmailData);
      toast({
        description: updatedImportance
          ? "Marked as important"
          : "Unmarked as important",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Failed to Mark Email as Important",
        variant: "destructive",
      });
    }
  };

  const formattedDate = new Date(mailResponse && mailResponse.created_datetime);

  return (
    <form onSubmit={handleSendMail}>
      <Card className="p-2.5 my-2.5 h-full flex flex-col w-[95%] md:w-[99%]  gap-5 m-2.5">
        {mailResponse && (
          <h1 className="mt-2 text-gray-500">
            Date: {formattedDate.toLocaleString()}
          </h1>
        )}
        <div className="flex flex-col border">
          <div className="flex  items-center">
            <span className="text-gray-500 pl-2.5 pr-4">
              {mailResponse?.sender_email && !isReply && !draftEmail
                ? "From"
                : "To"}
            </span>

            {to.map((recipient, index) => (
              <Badge key={index} className="flex items-center m-1 p-1 rounded">
                {recipient}
                {(!mailResponse ||
                  (draftEmail && Object.keys(draftEmail).length > 0)) && (
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
              disabled={mailResponse && !isReply && !draftEmail}
              type="email"
              onChange={(e) => handleInputChange(e, "to")}
            />
          </div>
          <div className="flex items-center">
            <span className="text-gray-500 pl-2.5 pr-4">Cc</span>
            {cc.map(
              (recipient, index) =>
                recipient && (
                  <Badge
                    key={index}
                    className="flex items-center m-1 p-1 rounded"
                  >
                    {recipient}
                    {(!mailResponse ||
                      (draftEmail && Object.keys(draftEmail).length > 0) || isReply) && (
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
              disabled={mailResponse && !isReply && !draftEmail}
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
                recipient && (
                  <Badge
                    key={index}
                    className="flex items-center m-1  p-1 rounded"
                  >
                    {recipient}
                    {(!mailResponse ||
                      (draftEmail && Object.keys(draftEmail).length > 0) || isReply) && (
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
              disabled={mailResponse && !isReply && !draftEmail}
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
          disabled={mailResponse && !isReply && !draftEmail}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
        />
        <div className="flex items-center space-x-2 gap-2.5 cursor-pointer border-b pb-2 mb-4">
          {mailResponse && isReply && <Undo2 onClick={() => setMessage("")} />}
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
          disabled={mailResponse && !isReply && !draftEmail}
        />
        <div className="flex ml-3 justify-between items-center">
          {mailResponse && !isReply && !draftEmail ? (
            <div className="flex items-center gap-5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Reply
                      className="transition ease-in-out  h-5 w-5 cursor-pointer hover:scale-150 duration-500"
                      onClick={handleReplyClick}
                    />
                  </TooltipTrigger>

                  <TooltipContent>
                    <p>Reply</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <ReplyAll className="transition ease-in-out  h-5 w-5 cursor-pointer hover:scale-150 duration-500"
                    onClick={handleReplyAllClick} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reply All</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Forward className="transition ease-in-out  h-5 w-5 cursor-pointer hover:scale-150 duration-500"
                    onClick={handleForwardClick} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Forward</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Star
                      onClick={handleImportant}
                      className={`${
                        isImportant && "text-orange-400 fill-orange-400"
                      } transition ease-in-out  h-5 w-5 cursor-pointer hover:scale-150 duration-500`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Important</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Flag className="transition ease-in-out  h-5 w-5 cursor-pointer hover:scale-150 duration-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Task</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Clipboard className="transition ease-in-out  h-5 w-5 cursor-pointer hover:scale-150 duration-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clipboard</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <MessageCircle className="transition ease-in-out  h-5 w-5 cursor-pointer hover:scale-150 duration-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chat</p>
                  </TooltipContent>
                </Tooltip>
                <MoreVertical className="transition ease-in-out  h-5 w-5 cursor-pointer hover:scale-150 duration-500" />
              </TooltipProvider>
            </div>
          ) : (
            <>
              <div className="flex gap-5">
                <Button
                  type="submit"
                  className="md:w-[125px]"
                  disabled={loading || !(to && subject && message)}
                >
                  {loading ? "Sending..." : "Send"}
                </Button>
                {!isReply && (
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={handleDraft}
                  >
                    {isDraftLoading ? "Saving..." : "Save as Draft"}
                  </Button>
                )}
                {isReply ? (
                  <Button
                    disabled={loading}
                    variant="secondary"
                    onClick={handleCancelReply}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Link href={"/email"}>
                    <Button disabled={loading} variant="secondary">
                      Cancel
                    </Button>
                  </Link>
                )}
              </div>
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
