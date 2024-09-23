"use client";
import NewMail from "@/components/mail/new-mail";
import { GET_EMAILS } from "@/constants/envConfig";
import React, { useEffect, useState } from "react";

interface EmailProps {
  params: {
    id: string;
  };
  searchParams: {};
}

const Page = (props: EmailProps) => {
  const { params } = props;
  const [response,setResponse] = useState<string[]>([])
  const [mails,setMails] = useState<string[]>([])

  const fetchAllEmails = async() => {
    const response = await fetch(GET_EMAILS, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
    });
    const result = await response.json();
    setMails(result)
  }

  const fetchEmail = async (id: string) => {
    const response = await fetch(`${GET_EMAILS}?email_id=eq.${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
    });
    const result = await response.json();
    setResponse(result)
  };

  useEffect(() => {
    fetchAllEmails()
  }, [])
  
  const repliedEmails = mails.filter((mail:any) => mail.for_email_id == params?.id);
  useEffect(() => {
    fetchEmail(params.id);
  }, [params.id]);
  return (
    <div>
      <NewMail response={response} repliedEmails={repliedEmails}  />
    </div>
  );
};

export default Page;
