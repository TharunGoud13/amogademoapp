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

  const fetchEmail = async (id: string) => {
    const response = await fetch(`${GET_EMAILS}?email_id=eq.${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
      },
    });
    const result = await response.json();
    setResponse(result)
    console.log("result-----", result);
  };

  useEffect(() => {
    fetchEmail(params.id);
  }, [params.id]);
  return (
    <div>
      <NewMail response={response}  />
    </div>
  );
};

export default Page;
