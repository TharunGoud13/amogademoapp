"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import { toast } from "../ui/use-toast";
import { GET_EMAILS } from "@/constants/envConfig";
import { send } from "process";
import { getAllImapDetails } from "@/lib/store/actions";

interface NewMailProps {
  getAllImapDetailsResponse:any
}

const NewMail:FC<NewMailProps> = ({getAllImapDetailsResponse})  => {
  const [receipient, setReceipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  let user: any = session?.user;
  const currentDate = new Date().toUTCString();
  let username = getAllImapDetailsResponse[0]?.data_response?.split(" ")[0];
  let password = getAllImapDetailsResponse[0]?.data_response?.split(" ")[1]


  const handleSendMail = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    try {
      const requestOptions = {
        method: "POST",
        body: JSON.stringify({ user, receipient, subject, message,username,password }),
        headers: { "Content-Type": "application/json" },
      };
      const response = await fetch("/api/send-email", requestOptions);
      if(!response.ok){
        toast({description: "Error sending email",variant:"destructive"})
      }
    //   if (response.ok) {
    //     setLoading(false);
    //     toast({ description: "Email sent successfully", variant: "default" });
    //     setReceipient("");
    //     setSubject("");
    //     setMessage("");
    //   } else {
    //     setLoading(false);
    //     setReceipient("");
    //     setSubject("");
    //     setMessage("");
    //     toast({
    //       description: "Something went wrong",
    //       variant: "destructive",
    //     });
    
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
            sender_name: user?.name,
            sender_mobile: user?.mobile,
            business_name: user?.business_name,
            business_number: user?.business_number,
            created_datetime: currentDate,
          }),
          headers: emailHeaders,
        };
        const sendEmail = await fetch(GET_EMAILS, emailRequestOptions);
        if (!sendEmail.ok) {
            toast({description: "Something went wrong",variant:"destructive"})
        }
        toast({ description: "Email sent successfully", variant: "default" })
            setReceipient("")
            setLoading(false)
            setSubject("")
            setMessage("")
      }
     catch (error) {
      toast({ description: "Failed to send email", variant: "destructive" });
      setLoading(false);
      console.error("Error sending email: ", error);
    }
  };
  return (
    <form onSubmit={handleSendMail}>
      <Card className="p-2.5 my-2.5 flex flex-col gap-5 m-2.5">
        <Input
          className="mt-3"
          value={receipient}
          type="email"
          onChange={(e) => setReceipient(e.target.value)}
          placeholder="Recipient's email"
        />
        <Input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <Textarea
          placeholder="Type your message here"
          value={message}
          className="resize-none"
          rows={14}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">{loading ? "Sending..." : "Send"}</Button>
      </Card>
    </form>
  );
}



export default NewMail;
