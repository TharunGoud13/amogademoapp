"use client"
import { MailList } from '@/components/mail/mail-list'
import { toast } from '@/components/ui/use-toast';
import { GET_EMAILS } from '@/constants/envConfig';
import React, { useEffect, useState } from 'react'

const Sent = () => {
  const [response,setResponse] = useState([])

  useEffect(() => {
    fetchEmails();
  },[])
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

  console.log("response----",response)
  return (
    <div>
      <MailList items={response && response?.length > 0 && response.filter((item:any) => item?.status == "sent" )}/>
    </div>
  )
}

export default Sent